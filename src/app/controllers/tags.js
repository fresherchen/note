'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Notes = require('./notes'),
  Tag = mongoose.model('Tag'),
  _ = require('lodash');
/**
 * Create a tag 
 */
exports.create = function(req,res){
  
  var tag = new Tag(req.body);
  tag.user = req.user.id;

  tag.save(function(err){
    if(err){
      return res.status(400).send({
        message:errorHandler.getErrorMessage(err)
      });
    }else{
      req.attr = 'addTag';
      res.json(tag);
    }
  });
};

/**
 * Show the current tag 
 */
exports.read = function(req, res){
  res.json(req.tag);
};

/**
 * List of Tags 
 */
exports.list = function(req,res){
  var searchCon = {user:req.user.id};
  if(req.body.tagsId){
    searchCon._id = { $in: req.body.tagsId};
  }
  if(req.query.tagName){
    searchCon.tagName = req.query.tagName;
    if(req.query.status === 'Fuzzy'){
      searchCon.tagName = new RegExp('.*'+req.query.tagName+'.*','gi');
    }
  }
  Tag.find(searchCon).exec(function(err,tags){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      res.json(tags);
    }
  });
};

/**
 * update this tag
 */
exports.update = function(req,res){

  var tag = req.tag;
  tag = _.extend(tag, req.body);
  
  tag.save(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(tag);
    }
  });
};

/**
 * delete a tag 
 */
exports.delete = function(req,res){
  
  var tag = req.tag;
  tag = _.extend(tag, req.body);
  
  tag.remove(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      req.attr = 'removeTag';
      Notes.updateMultiNotes(req,res);
    }
  });
};

/**
 * tagByID 
 */
exports.tagByID = function(req, res, next, id){
  Tag.findById(id).populate('user', 'displayName').exec(function(err, tag) {
    if (err) return next(err);
    if (!tag) return next(new Error('Failed to load tag ' + id));
    req.tag = tag;
    next();
  });
};

/**
 * Tag authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  req.user.id = (req.user.id).toString();
  if (req.tag.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};

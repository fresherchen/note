'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Notes = require('./notes'),
  Tag = mongoose.model('Tag'),
  index = require('../../dbconf/index'),
  querystring = require('querystring'),
  _ = require('lodash');
/**
 * Create a tag
 */
exports.create = function(req,res){

  var tagVal = new Tag(req.body);
  // tag.user = req.body.user;
  var tag = JSON.parse(JSON.stringify(tagVal));
      // console.dir(tag.user);
  if(!tag.user){
    return res.json({message: 'The tag user is null!'});
  }
  if(!tag.tagName){
    return res.json({message: 'The tag name is null!'});
  }
  var searchCon = {user:tag.user,tagName:tag.tagName};
  if(index.dbMode === 'json-server'){
    var path = req.path +'?'+querystring.stringify(searchCon);
    index.operations(path,'','',function(tagExt){
      console.dir(JSON.parse(tagExt).length);
      if(!JSON.parse(tagExt).length){
        index.operations(req.path,req.method,tag,function(data,code){
            // The tag can not be insert to the note when using the json-server
            res.json(JSON.parse(data));
        });
      }else{
        res.json({message: 'This tag is existed!'});
      }
    });
  }else if(index.dbMode === 'mongo'){
    Tag.find(searchCon).exec(function(err,data){
      if(!data.length){
        tag.save(function(err){
          if(err){
            return res.status(400).send({
              message:errorHandler.getErrorMessage(err)
            });
          }else{
            req.attr = 'addTag';
            Notes.updateTag(req,res);
          }
        });
      }else{
        res.json({message: 'This tag is existed!'});
      }
    });
  }
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
  var searchCon = {user:req.query.user};
  if(req.query.tagsId){
    searchCon._id = { $in: req.query.tagsId };
    if(index.dbMode === 'json-server'){
      delete searchCon._id;
      searchCon.q = req.query.tagsId;
    }
  }
  if(req.query.tagName){
    searchCon.tagName = req.query.tagName;
    if(req.query.status === 'Fuzzy'){
      searchCon.tagName = new RegExp('.*'+req.query.tagName+'.*','gi');
      if(index.dbMode === 'json-server'){
        delete searchCon.tagName;
        searchCon.tagName_like = req.query.tagName;
      }
    }
  }
  if(index.dbMode === 'json-server'){
    // console.dir(searchCon);
    var path = req.path+'?'+querystring.stringify(searchCon);
    index.operations(path,'','',function(data){
      res.json(JSON.parse(data));
    });
  }else if(index.dbMode === 'mongo'){
    Tag.find(searchCon).exec(function(err,tags){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else {
        res.json(tags);
      }
    });
  }
};

/**
 * update this tag
 */
exports.update = function(req,res){

  var tag = req.tag;
  tag = _.extend(tag, req.body);
  var searchCon = {user:tag.user,tagName:tag.tagName};
  if(index.dbMode === 'json-server'){
    var urlVal = req.path.split('/');
    var path = '/'+urlVal[1]+'?'+querystring.stringify(searchCon);
    index.operations(path,'','',function(tagExt){

      if(!JSON.parse(tagExt).length){
        index.operations(req.path,'PUT',tag,function(data){
          res.json(JSON.parse(data));
        });
      }else{
        res.json({message: 'This tag is existed!'});
      }
    });
  }else if(index.dbMode === 'mongo'){
    Tag.find(searchCon).exec(function(err,tagExt){
      if(err){
        return res.status(400).send({
          message:errorHandler.getErrorMessage(err)
        });
      }else if(!tagExt.length){
        tag.save(function(err){
          if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }else{
            res.json(tag);
          }
        });
      }else{
        res.json({message: 'This tag is existed!'});
      }
    });
  }
};

/**
 * delete a tag
 */
exports.delete = function(req,res){

  var tag = req.tag;
  tag = _.extend(tag, req.body);
  if(index.dbMode === 'json-server'){
    index.operations(req.path,req.method,'',function(data,code){
      res.json({message:'Tag delete successfully,but the tag in note can not be deleted when you use json-server!'});
    // removing the tag in notes can not be achieve with the json-server
    });
  }else if(index.dbMode === 'mongo'){
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
  }
};

/**
 * tagByID
 */
exports.tagByID = function(req, res, next, id){
  if(index.dbMode === 'json-server'){
    index.operations(req.path,'','',function(data,code){
      if(code === 404){
        return next(new Error('Failed to load tag'));
      }
      req.tag = JSON.parse(data);
      next();
    });
  }else if(index.dbMode === 'mongo'){
    Tag.findById(id).exec(function(err, tag) {
      if (err) return next(err);
      if (!tag) return next(new Error('Failed to load tag ' + id));
      req.tag = tag;
      next();
    });
  }
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

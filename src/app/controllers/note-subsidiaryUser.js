'use strict';

/**
 *  Subsidiary user model dependence of note
 */
var mongoose = require('mongoose'),
  SubsidiaryNoteUser = mongoose.model('SubsidiaryNoteUser'),
  errorHandler = require('./errors'),
  _ = require('lodash');
/**
 * create a SubsidiaryNoteUser 
 */
exports.create = function(req,res){
  
  var subsidiaryUser = new SubsidiaryNoteUser({
    _id: req.user.id,
    listmode: 'list',
    sortmode: '-updatedOn'
  });
  subsidiaryUser.save(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(subsidiaryUser);
    }
  });
};

/**
 *  get the SubsidiaryNoteUser schema
 */
exports.read = function(req,res){
  //get by user
  SubsidiaryNoteUser.findById(req.user.id).exec(function(err,subsidiaryNoteUser){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(subsidiaryNoteUser);
    }
  });
};

/**
 * change the mode 
 */
exports.update = function(req,res){
  
  var conditions = {
    _id:req.user.id
  };
  var update;
  if(req.body.listmode)
  update = {
    $set:{
      listmode:req.body.listmode
    }
  };
  if(req.body.sortmode)
  update = {
    $set:{
      sortmode:req.body.sortmode
    }
  };
  var options = {
    multi:false
  };
  SubsidiaryNoteUser.update(conditions,update,options,function(err,numAffected){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(numAffected);
    }
  });
};

/**
 * delete the mode
 */
exports.delete = function(req,res){
  var subUser = new SubsidiaryNoteUser({_id:req.user.id});

  subUser.remove(function(err){
    if(err){
      return res.status(400).send({
        message:errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subUser);
    }
  });
};

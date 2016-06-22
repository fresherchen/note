'use strict';

/**
 *  Subsidiary user model dependence of note
 */
var mongoose = require('mongoose'),
  SubsidiaryNoteUser = mongoose.model('SubsidiaryNoteUser'),
  errorHandler = require('./errors'),
  index = require('../../dbconf/index'),
  querystring = require('querystring'),
  _ = require('lodash');
/**
 * create a SubsidiaryNoteUser
 */
exports.create = function(req,res){

  var subsidiaryUser = new SubsidiaryNoteUser({
    _id: req.body.user,
    listmode: 'list',
    sortmode: '-updatedOn'
  });
  if(index.dbMode === 'json-server'){
    index.operations(req.path,req.method,subsidiaryUser,function(data){
      res.json(JSON.parse(data));
    });
  }else if(index.dbMode === 'mongo'){
    subsidiaryUser.save(function(err){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        res.json(subsidiaryUser);
      }
    });
  }
};

/**
 *  get the SubsidiaryNoteUser schema
 */
exports.read = function(req,res){
  //get by user
  if(index.dbMode === 'json-server'){
    index.operations(req.path,'','',function(data){
      res.json(JSON.parse(data));
    });
  }else if(index.dbMode === 'mongo'){
    SubsidiaryNoteUser.findById(req.body.user).exec(function(err,subsidiaryNoteUser){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        res.json(subsidiaryNoteUser);
      }
    });
  }
};

/**
 * change the mode
 */
exports.update = function(req,res){

  var conditions = {
    _id:req.body.user
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

  if(index.dbMode === 'json-server'){
    index.operations(req.path,'','',function(cbData,code){
      if(code === 404){
        return res.json({message:'Fail to load the subUser!'});
      }else{
        var subUser = _.extend(cbData,req.body);
        index.operations(req.path,'PUT',subUser,function(data){
          res.json(JSON.parse(data));
        });
      }
    });
  }else if(index.dbMode === 'mongo'){
    SubsidiaryNoteUser.update(conditions,update,options,function(err,numAffected){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        res.json(numAffected);
      }
    });
  }
};

/**
 * delete the mode
 */
exports.delete = function(req,res){
  var subUser = new SubsidiaryNoteUser({_id:req.body.user});

  if(index.dbMode === 'json-server'){
    index.operations(req.path,req.method,'',function(data){
      res.json(JSON.parse(data));
    });
  }else if(index.dbMode === 'mongo'){
    subUser.remove(function(err){
      if(err){
        return res.status(400).send({
          message:errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(subUser);
      }
    });
  }
};

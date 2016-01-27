'use strict';

/**
 * Module dependencies 
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Notebook = mongoose.model('Notebook'),
  Note = mongoose.model('Note'),
  nodemailer = require('nodemailer'),
  config = require('../../config/config'),
  _ = require('lodash');
/**
 * Create a note 
 */
exports.create = function(req,res){
  var note = new Note(req.body);
  note.user = req.user.id;
  
  if(note.content.length>100000){
    return res.status(400).send({
      message: 'The note content is too long !'
    });
  }
  
  var searchCon = {user:req.user.id,isDefault:true};
  if(!req.body.notebookId){
    Notebook.find(searchCon).exec(function(err,result){
      if(!result.length){
        res.json({message:'The notebookId is null and you have no default notebook yet!!!'});
        // return;
      }else{
        note.notebookId = result[0]._id;
        saveNote(note);
      }
    });
  }else{
    saveNote(note);
  }
  var saveNote = function(note){
    note.save(function(err){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        res.json(note);
      }
    });
  };
};

/**
 * Show the current note 
 */
exports.read = function(req, res){
  res.json(req.note);
};

/**
 * Update a note 
 */
exports.update = function(req, res) {
  var note = req.note;
  
  req.body.updatedOn = new Date();
  note = _.extend(note, req.body);

  if(note.content.length>100000){
    return res.status(400).send({
      message: 'The note content is too long !'
    });
  }
  note.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(note);
    }
  });
};

/**
 * update the note's tag attr 
 */
exports.updateTag = function(req,res){

  var conditions = {
    user: req.user.id,
    _id: req.body.noteId
  };
  var options = {
    multi: true
  };
  var update = {
    $pull : {
      tag : req.body.tag
    }
  };
  if(req.body.flag === 'add'){
    update = {
      $push : {
        tag : req.body.tag
      }
    };
  }
  console.dir(update);
  Note.update(conditions, update, options, function(err, numAffected){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      var result = 'The tag has been removed from this note successfuly!!!'
      if(req.body.flag === 'add')
        result = 'The tag has been added to this note successfuly!!!'
      res.json({message:result});
    }
  });
};

/**
 * Delete a note 
 */
exports.delete = function(req, res) {
  var note = req.note;

  note.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(note);
    }
  });
};

/**
 * Move multiNotes to Trash or remove tag  
 */
exports.updateMultiNotes = function(req,res) {

  var conditions = {
      user: req.user.id
  };
  if(req.attr === 'inTrash')
    conditions = {
      user: req.user.id,
      notebookId: req.notebook.id
  };
  var options = {
      multi: true
  };
  var update = {
      $set: {
        updatedOn:new Date(),
        inTrash: true
      }
  };
  if(req.attr === 'removeTag'){
    update = {
        $pull : {
          tag : req.params.tagId
        }
    };
  }
  Note.update(conditions, update, options, function(err, numAffected){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      if(req.attr === 'inTrash')
      var result = 'Notebook was removed successfuly!!!';
      if(req.attr === 'removeTag')
        result = 'Tag was removed successfuly!!!';
      res.json({message: result});
    }
  });
};

/**
 * List of Notes 
 */
exports.list = function(req,res){
  var searchCon = {user: req.user.id, notebookId: req.query.notebookId, $nor: [{inTrash : true}]};
  if(req.query.key){
    var key = new RegExp('.*'+req.query.key+'.*','gi');
    searchCon.$or = [{'title': key},{'content': key}];
  }
  if(req.query.notebookId === 'allnotes' || req.query.notebookId === undefined){
    delete searchCon.notebookId;
  }
  if(req.query.notebookId === 'trash'){
    searchCon.inTrash = true;
    delete searchCon.$nor;
    delete searchCon.notebookId;
  }
  if(req.query.tag){
    searchCon.tag = {$in:[req.query.tag]};
  }
  
  var sortmode = req.query.sortmode ? req.query.sortmode:'-updatedOn';

  Note.find(searchCon).sort(sortmode).exec(function(err,notes){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(notes);
    }
  });
};

/**
 * SendNyMail 
 */

exports.sendByMail = function(req, res) {

  var smtpTransport = nodemailer.createTransport(config.mailer.options);
  var mailOptions = {
    to: req.body.mailAndNote.email,
    from: config.mailer.from,
    subject: 'Share Note Send By Mail',
    html: req.body.mailAndNote.message
  };
  smtpTransport.sendMail(mailOptions, function(err) {
    if (!err) {
      res.send({
        message: 'An email has been sent to ' + user.email + ' with further instructions.'
      });
    } else {
      res.status(400).send({
        message: 'Failure sending email'
      });
    }
  });
};

/**
 * Note middleware
 */
exports.noteByID = function(req, res, next, id) {
  Note.findById(id).populate('user', 'displayName').exec(function(err, note) {
    if (err) return next(err);
    if (!note) return next(new Error('Failed to load note ' + id));
    req.note = note;
    next();
  });
};

/**
 * Note authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  req.user.id = (req.user.id).toString();
  if (req.note.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
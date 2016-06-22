'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Notebook = mongoose.model('Notebook'),
  Note = mongoose.model('Note'),
  // nodemailer = require('nodemailer'),
  nodemailer,
  config = require('../../config/config'),
  index = require('../../dbconf/index'),
  querystring = require('querystring'),
  _ = require('lodash');
/**
 * Create a note
 */
exports.create = function(req,res){
  var note = new Note(req.body);
  // note.user = req.body.user;
  if(!note.user){
    return res.json({message: 'The note user is null!'});
  }
  if(note.content.length>100000){
    return res.status(400).send({
      message: 'The note content is too long !'
    });
  }

  var searchCon = {user:req.body.user,isDefault:true};
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
  if(index.dbMode === 'json-server'){
    if(!req.body.notebookId){
      var path = '/notebooks'+'?'+querystring.stringify(searchCon);
      index.operations(path,'','',function(data){
        if(!JSON.parse(data).length){
          res.json({message:'The notebookId is null and the default notebook is not found yet!!!'});
        }else{
          note.notebookId = JSON.parse(data)[0]._id;
          index.operations(req.path,req.method,note,function(data,code){
            res.json(JSON.parse(data));
          });
        }
      });
    }else{
      index.operations(req.path,req.method,note,function(data,code){
        res.json(JSON.parse(data));
      });
    }
  }else if(index.dbMode === 'mongo'){
    if(!req.body.notebookId){
      Notebook.find(searchCon).exec(function(err,result){
        if(!result.length){
          res.json({message:'The notebookId is null and the default notebook is not found yet!!!'});
        }else{
          note.notebookId = result[0]._id;
          saveNote(note);
        }
      });
    }else{
      saveNote(note);
    }
  }
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
    // note.user = req.body.user;
  req.body.updatedOn = new Date();
  note = _.extend(note, req.body);

  if(note.content.length>100000){
    return res.status(400).send({
      message: 'The note content is too long !'
    });
  }
  if(index.dbMode === 'json-server'){
    index.operations(req.path,'PUT',note,function(data,code){
      res.json(JSON.parse(data));
    });
  }else if(index.dbMode === 'mongo'){
    note.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(note);
      }
    });
  }
};

/**
 * update the note's tag attr
 */
exports.updateTag = function(req,res){

  var conditions = {
    user: req.body.user,
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
      var result = 'The tag has been removed from this note successfuly!!!';
      if(req.body.flag === 'add')
        result = 'The tag has been added to this note successfuly!!!';
      res.json({message:result});
    }
  });
};

/**
 * Delete a note
 */
exports.delete = function(req, res) {
  var note = req.note;
  if(index.dbMode === 'json-server'){
    index.operations(req.path,req.method,'',function(data,code){
      res.json({message:'Delete the note successfuly!'});
    });
  }else if(index.dbMode === 'mongo'){
    note.remove(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(note);
      }
    });
  }
};

/**
 * Move multiNotes to Trash or remove tag
 */
exports.updateMultiNotes = function(req,res) {

  var conditions = {
    user: req.body.user
  };
  if(req.attr === 'inTrash')
    conditions = {
      user: req.body.user,
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
      var result;
      if(req.attr === 'inTrash')
        result = 'Notebook was removed successfuly!!!';
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
  var searchCon = {},count,limit,sort;
  if(req.query){
    searchCon = {user: req.query.user, notebookId: req.query.notebookId, $nor: [{inTrash : true}]};
    if(index.dbMode === 'json-server'){
      delete searchCon.$nor;
      searchCon.inTrash_ne = true;
    }
  }

  if(!req.query.user){
    return res.json({message:'User is empty!'});
  }
  if(req.query.key){
    var key = new RegExp('.*'+req.query.key+'.*','gi');
    searchCon.$or = [{'title': key},{'content': key}];
    if(index.dbMode === 'json-server'){
      delete searchCon.$or;
      searchCon.q = req.query.key;
    }
  }
  if(req.query.notebookId === 'allnotes' || !req.query.notebookId){
    delete searchCon.notebookId;
  }
  if(req.query.notebookId === 'trash'){
    searchCon.inTrash = true;
    delete searchCon.$nor;
    delete searchCon.notebookId;
  }
  if(req.query.tag){
    searchCon.tag = {$in:[req.query.tag]};
    if(index.dbMode === 'json-server'){
      delete searchCon.tag;
      searchCon.q = req.query.tag;
    }
  }
  if(req.query.count && req.query.limit){
    limit = req.query.limit;
    count = (req.query.count-1)*limit;
  }
  sort = req.query.sort ? req.query.sort : '-updatedOn';
  var _sort = '&_sort='+sort;
  var _limit = '&_limit='+limit;
  if(index.dbMode === 'json-server'){
    // delete searchCon.$nor;
    var path = req.path+'?'+querystring.stringify(searchCon)+_sort;
    if(limit)
      path = path+_limit;
    console.dir(path);
    index.operations(path,'','',function(data){
      res.json(JSON.parse(data));
    });
  }else if(index.dbMode === 'mongo'){
    Note.find(searchCon).sort(sort).exec(function(err,notes){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(notes);
      }
    });
  }
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
        message: 'An email has been sent to XXXX with further instructions.'
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
  if(index.dbMode === 'json-server'){
    var path = req.path;
    index.operations(path, '', '', function(data,code){
      if(code === 404){
        return next(new Error('Failed to load the note'));
      }
      req.note = JSON.parse(data);
      next();
    });
  }else if(index.dbMode === 'mongo'){
    Note.findById(id).exec(function(err, note) {
      if (err) return next(err);
      if (!note) return next(new Error('Failed to load note ' + id));
      req.note = note;
      next();
    });
  }
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

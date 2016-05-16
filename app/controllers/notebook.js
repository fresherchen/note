'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Notebook = mongoose.model('Notebook'),
  Notes = require('./notes'),
  errorHandler = require('./errors'),
  _ = require('lodash');

exports.index = function(req, res) {
  res.render('index', {
    title: 'NotesService',
    content: 'The NotesService server is running ~'
  });
};

/**
 * Create a notebook
 */
exports.create = function(req, res){

  var notebook = new Notebook(req.body);
    notebook.user = req.user.id;

  var searchCon = {user:req.user.id, notebookName:notebook.notebookName};
  Notebook.find(searchCon).exec(function(err,result){
    if(!result.length){
      if(notebook.isDefault){
        delete searchCon.notebookName;
        searchCon.isDefault = true;
        Notebook.find(searchCon).exec(function(err,callback){
          if(!callback.length){
            saveNotebook(notebook);
          }else{
            res.send({message:'You can only have one Default notebook!!!'});
          }
        });
      }else{
        saveNotebook(notebook);
      }
    }else{
      res.send({message:'This notebook is already existed!!!'});
    }
  });
  var saveNotebook = function(notebook){
    notebook.save(function(err){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        res.json(notebook);
      }
    });
  };
};

/**
 * Show the current notebook
 */
exports.read = function(req, res){
  res.json(req.notebook);
};

/**
 * Update a Notebook
 */
exports.update = function(req,res){
  var notebook = req.notebook;

  notebook = _.extend(notebook, req.body);
  var updateBook = function(numAffected){
    notebook.save(function(err){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        res.json(notebook);
      }
    });
  };

  var searchCon = {user:req.user.id, isDefault:'true'};
  if(notebook.isDefault){
    Notebook.find(searchCon).exec(function(err,OriginalNotebook){
      if(err){
        return res.status(400).send({
          message:errorHandler.getErrorMessage(err)
        });
      }else{
        if(OriginalNotebook[0]){
          if(OriginalNotebook._id.toString() === notebook._id.toString()){
            updateBook();
          }else{
            var conditions = {
              user:req.user.id,
              isDefault:true
            };
            var update = {
              $set:{isDefault:false}
            };
            var options = {
              multi:true
            };
            Notebook.update(conditions, update, options, function(err,numAffected){
              if(err){
                throw err;
              }else{
                updateBook(numAffected);
              }
            });
          }
        }else{
          updateBook();
        }
      }
    });
  }else{
    updateBook();
  }
};

/**
 * Update a notebook
 */
exports.delete = function(req,res){
  var notebook = req.notebook;
  if(notebook.isDefault){
    // this method needs to edit maybe
    // new Error('Default notebook can not be deleted');
    return res.state(403).send({
      message: 'Default notebook can not be deleted'
    });
  }else{
    notebook.remove(function(err){
      if(err){
        return res.status(400).send({
          message:errorHandler.getErrorMessage(err)
        });
      }else{
        req.attr = 'inTrash';
        Notes.updateMultiNotes(req,res);
      }
    });
  }
};

/**
 * List of Notebooks
 */
exports.list = function(req,res){

  var searchCon = {user:req.user.id};

  searchCon = _.assign(searchCon,req.query);
  Notebook.find(searchCon).sort().exec(function(err,notebooks){
    if(err){
      return res.status(400).send({
        message:errorHandler.getErrorMessage(err)
      });
    }else{
      res.json(notebooks);
    }
  });
};

/**
 * Notebook middleware
 */
exports.notebookById = function(req,res,next,id){
  Notebook.findById(id).populate('user', 'displayName').exec(function(err, notebook){
    if(err) return next(err);
    // if(!notebook) return next(new Error('Failed to load notebook'+id)); ??
    if(!notebook) return next('Failed to load notebook'+id);
    req.notebook = notebook;
    next();
  });
};

/**
 * Notebook authorization middleware
 */
exports.hasAuthorization = function(req,res,next){
  req.user.id = (req.user.id).toString();
  if(req.notebook.user.id !== req.user.id){
    return res.state(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};

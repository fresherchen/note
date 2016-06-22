'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Notebook = mongoose.model('Notebook'),
  Notes = require('./notes'),
  errorHandler = require('./errors'),
  index = require('../../dbconf/index'),
  querystring = require('querystring'),
  _ = require('lodash');

exports.index = function(req, res) {
  res.render('index', {
    title: 'NotesService',
    content: 'The NotesService server is running with '+ (index.dbMode).charAt(0).toUpperCase()+ (index.dbMode).slice(1) +'~'
  });
};

/**
 * Create a notebook
 */
exports.create = function(req, res){

  var notebookVal = new Notebook(req.body);
  var notebook = JSON.parse(JSON.stringify(notebookVal));
  if(!notebook.user){
    return res.json({message: 'User is null!'});
  }
  if(!notebook.notebookName){
    return res.json({message: 'Book name is null!'});
  }
  if(!notebook.isDefault){
    return res.json({message: 'isDefault attr is null!'});
  }
  var searchCon = {user:req.body.user, notebookName:notebook.notebookName};
  if(index.dbMode === 'json-server'){
    var path = req.path+'?'+querystring.stringify(searchCon);
    index.operations(path,'','',function(nameExisted){
      // console.dir(JSON.parse(nameExisted));
      if(!JSON.parse(nameExisted).length){
        if(notebook.isDefault){
          delete searchCon.notebookName;
          searchCon.isDefault = true;
          path = req.path+'?'+querystring.stringify(searchCon);
          index.operations(path,'','',function(defaultExisted){
            if(!JSON.parse(defaultExisted).length){
              index.operations(req.path,req.method,notebook,function(returnData){
                res.json(JSON.parse(returnData));
              });
            }else{
              res.json({message:'You can only have one Default notebook!!!'});
            }
          });
        }else{
          index.operations(req.path,req.method,notebook,function(returnData){
            res.json(JSON.parse(returnData));
          });
        }
      }else{
        res.json({message:'This name of notebook is already existed!!!'});
      }
    });
  }else if(index.dbMode === 'mongo'){
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
        res.send({message:'This name of notebook is already existed!!!'});
      }
    });
  }
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

  var bb = function(callback){
    delete searchCon.notebookName;
    searchCon.isDefault = true;
    path = '/'+urlVar[1]+'?'+querystring.stringify(searchCon);
    index.operations(path,'','',function(data){
      if(!JSON.parse(data).length){
        index.operations(req.path,'PUT',notebook,function(returnData){
          callback(returnData);
        });
      }else if(JSON.parse(data).length){
        if(JSON.parse(data)[0]._id === notebook._id){
          index.operations(req.path,'PUT',notebook,function(returnData){
            callback(returnData);
          });
        }else{
          var pathDef = '/'+urlVar[1]+'/'+JSON.parse(data)[0]._id;
          var ttt = JSON.parse(data)[0];
          ttt.isDefault = false;
          index.operations(pathDef,'PUT',ttt,function(data,code){
            if(code === 200){
              index.operations(req.path,'PUT',notebook,function(returnData){
                callback(returnData);
              });
            }
          });
        }
      }
    });
  };

  var aa = function(){
    delete searchCon.notebookName;
    searchCon.isDefault = true;
    Notebook.find(searchCon).exec(function(err,OriginalNotebook){
      if(err){
        return res.status(400).send({
          message:errorHandler.getErrorMessage(err)
        });
      }else if(OriginalNotebook[0]){
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
    });
  };
  var searchCon = {user:notebook.user, notebookName:notebook.notebookName};
  if(index.dbMode === 'json-server'){
    var urlVar = (req.path).split('/');
    var path = '/'+urlVar[1]+'?'+querystring.stringify(searchCon);
    // console.dir(path);
    index.operations(path,'','',function(data){
      if(!JSON.parse(data).length){
        if(notebook.isDefault){
          bb(function(cbData){
            res.json(JSON.parse(cbData));
          });
        }else{
          index.operations(req.path,'PUT',notebook,function(returnData){
            res.json(JSON.parse(returnData));
          });
        }
      }else if(JSON.parse(data).length){
        if(notebook.isDefault){
          bb(function(cbData){
            res.json(JSON.parse(cbData));
          });
        }else{
          if(JSON.parse(data)[0]._id === notebook._id){
            index.operations(req.path,'PUT',notebook,function(returnData){
              res.json(JSON.parse(returnData));
            });
          }else{
            res.json({message:'This name of notebook is already existed!!!'});
          }
        }
      }
    });
  }else if(index.dbMode === 'mongo'){
    Notebook.find(searchCon).exec(function(err,bookExt){
      if(!bookExt.length){
        if(notebook.isDefault){
          aa();
        }else{
          updateBook();
        }
      }else if(bookExt.length){
        if(notebook.isDefault){
          aa();
        }else{
          if(bookExt[0]._id === notebook._id){
            updateBook();
          }else{
            res.json({message:'This name of notebook is already existed!!!'});
          }
        }
      }
    });
  }
};

/**
 * Update a notebook
 */
exports.delete = function(req,res){
  var notebook = req.notebook;
  if(notebook.isDefault){
    // this method needs to edit maybe
    return res.status(403).send({
      message: 'Default notebook can not be deleted'
    });
  }else{
    if(index.dbMode === 'json-server'){
      index.operations(req.path,req.method,'',function(data,code){
        if(code === 200){
          // delete all the note in this notebook
          var urlVar = (req.path).split('/');
          var path = '/notes'+'?'+querystring.stringify({notebookId:urlVar[2]});
          index.operations(path,'','',function(notes){
            if(!JSON.parse(notes).length){
              res.json({message:'Notebook and note has been deleted successfully!'});
            }else{
              var count = JSON.parse(notes).length;
              var ac=[];
              var deleteNote = function(note){
                var childPath = '/notes'+'/'+note._id;
                // console.dir(childPath);
                note.inTrash = true;
                index.operations(childPath,'PUT',note,function(data,code){
                  ac.push(data);
                  if(i === ac.length){
                    res.json({message:'Notebook and note has been deleted successfully!'});
                  }
                });
              };
              for(var i=0; i<count; i++){
                deleteNote(JSON.parse(notes)[i]);
              }
            }
          });
        }
      });
    }else if(index.dbMode === 'mongo'){
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
  }
};

/**
 * List of Notebooks
 */
exports.list = function(req,res){
  var searchCon={};
  if(req.query){
    if(req.query.user){
      searchCon = {user:req.query.user};
    }else{
      return res.json({message:'User is empty!'});
    }
  }else{
    return res.json({message:'User is empty!'});
  }

  searchCon = _.assign(searchCon,req.query);
  if(index.dbMode === 'json-server'){
    var path = req.path+'?'+querystring.stringify(searchCon);
    index.operations(path,'','',function(data){
      res.json(JSON.parse(data));
    });
  }else if(index.dbMode === 'mongo'){
    Notebook.find(searchCon).sort().exec(function(err,notebooks){
      if(err){
        return res.status(400).send({
          message:errorHandler.getErrorMessage(err)
        });
      }else{
        res.json(notebooks);
      }
    });
  }
};

/**
 * Notebook middleware
 */
exports.notebookById = function(req,res,next,id){
  if(index.dbMode === 'json-server'){
    index.operations(req.path,'','',function(data,code){
      if(code === 404){
        return next(new Error('Failed to load notebook'));
      }
      req.notebook = JSON.parse(data);
      next();
    });
  }else if(index.dbMode === 'mongo'){
    Notebook.findById(id).exec(function(err, notebook){
      if(err) return next(err);
      if(!notebook) return next(new Error('Failed to load notebook'+id));
      req.notebook = notebook;
      next();
    });
  }
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

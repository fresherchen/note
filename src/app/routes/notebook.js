'use strict';

/**
 * Module dependencies
 */
var checkToken = require('../../app/controllers/check-token'),
  mongoose = require('mongoose'),
  index = require('../../dbconf/index'),
  notebook = require('../../app/controllers/notebook');

module.exports = function(app){
  app.route('/')
  .get(notebook.index);

  app.route('/api/:filename')
  .get(checkToken.checkTokeninUrl,index.getApi);
  // Notebook routes
  app.route('/notebooks')
  .get(checkToken.checkTokeninUrl,notebook.list)
  .post(checkToken.checkTokeninBody,notebook.create);

  app.route('/notebooks/:notebookId')
  .get(checkToken.checkTokeninUrl, notebook.read)
  .post(checkToken.checkTokeninBody, notebook.update)
  .delete(checkToken.checkTokeninBody, notebook.delete);
  // .delete(checkToken.checkTokeninBody, notebook.hasAuthorization, notebook.delete);

  // Finish by binding the notebook middleware
  app.param('notebookId', notebook.notebookById);
};

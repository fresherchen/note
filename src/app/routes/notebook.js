'use strict';

/**
 * Module dependencies 
 */
var 
// users = require('../../app/controllers/users'),
	checkToken = require('../../app/controllers/check-token'),
	mongoose = require('mongoose'),
	notebook = require('../../app/controllers/notebook');
	
module.exports = function(app){
	// Notebook routes
	app.route('/notebooks')
	.get(checkToken.checkTokeninUrl,notebook.list)
	.post(checkToken.checkTokeninBody,notebook.create);

	app.route('/notebooks/:notebookId')
	.get(checkToken.checkTokeninUrl, notebook.read)
	.post(checkToken.checkTokeninBody, notebook.hasAuthorization, notebook.update)
	.delete(checkToken.checkTokeninBody, notebook.hasAuthorization, notebook.delete);

	// Finish by binding the notebook middleware
	app.param('notebookId', notebook.notebookById);
};
'use strict';

/**
 * Module dependencies 
 */
var 
// users = require('../../app/controllers/users'),
	checkToken = require('../../app/controllers/check-token'),
	notes = require('../../app/controllers/notes');
	
module.exports = function(app){
	// Note routes
	app.route('/notes')
	.get(checkToken.checkTokeninUrl, notes.list)
	.post(checkToken.checkTokeninBody, notes.create);
	
	app.route('/notes/addTag')
	.put(checkToken.checkTokeninBody, notes.updateTag);
	
	app.route('/notes/removeTag')
	.put(checkToken.checkTokeninBody, notes.updateTag);
	
	app.route('/notes/search')
	.post(checkToken.checkTokeninBody, notes.getNoteBykey);
	
	app.route('/notes/sendByMail')
	.post(checkToken.checkTokeninBody, notes.sendByMail);
	
	app.route('/notes/:noteId')
	.get(checkToken.checkTokeninUrl, notes.read)
	.put(checkToken.checkTokeninBody, notes.hasAuthorization, notes.update)
	.delete(checkToken.checkTokeninBody, notes.hasAuthorization, notes.delete);
	
	// Finish by binding the note middleware
	app.param('noteId', notes.noteByID);
};

'use strict';

/**
 * Module dependencies.
 */
var 
// users = require('../../app/controllers/users'),
	checkToken = require('../../app/controllers/check-token'),
	subsidiaryNoteUser = require('../../app/controllers/note-subsidiaryUser');
	
module.exports = function(app){
	// SubsidiaryNoteUser routes
	
	app.route('/subsidiaryNoteUser')
	.get(checkToken.checkTokeninUrl,subsidiaryNoteUser.read)
	.post(checkToken.checkTokeninBody,subsidiaryNoteUser.create)
	.put(checkToken.checkTokeninBody,subsidiaryNoteUser.update)
	.delete(checkToken.checkTokeninBody,subsidiaryNoteUser.delete);
};
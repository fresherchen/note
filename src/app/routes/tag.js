'use strict';

/**
 * Module dependencies
 */
var 
// users = require('../../app/controllers/users'),
	checkToken = require('../../app/controllers/check-token'),
	tags = require('../../app/controllers/tags');

module.exports = function(app){
	//Tag routes 
	app.route('/tags')
	.get(checkToken.checkTokeninUrl, tags.list)
	.post(checkToken.checkTokeninBody, tags.create);
	
	app.route('/tags/search')
	.post(checkToken.checkTokeninBody, tags.list);
	
	app.route('/tags/:tagId')
	.get(checkToken.checkTokeninUrl, tags.read)
	.post(checkToken.checkTokeninBody, tags.hasAuthorization, tags.update)
	.delete(checkToken.checkTokeninBody, tags.hasAuthorization, tags.delete);
	
	// Finish by binding the tag middleware
	app.param('tagId', tags.tagByID);
};

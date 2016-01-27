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
  
  app.route('/notes/tag')
  .post(checkToken.checkTokeninBody, notes.updateTag);
  
  app.route('/notes/mail')
  .post(checkToken.checkTokeninBody, notes.sendByMail);
  
  app.route('/notes/:noteId')
  .get(checkToken.checkTokeninUrl, notes.read)
  .post(checkToken.checkTokeninBody, notes.hasAuthorization, notes.update)
  .delete(checkToken.checkTokeninBody, notes.hasAuthorization, notes.delete);
  
  // Finish by binding the note middleware
  app.param('noteId', notes.noteByID);
};

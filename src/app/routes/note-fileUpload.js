'use strict';
var multipart = require('connect-multiparty'),
  multipartMiddleware = multipart(),
  checkToken = require('../../app/controllers/check-token'),
  fUpload = require('../../app/controllers/note-fileUpload');

module.exports = function(app){

  app.route('/fileUpload')
  .post(checkToken.checkTokeninBody,multipartMiddleware,fUpload.fileUpload);
};

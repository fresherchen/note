'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose');

exports.checkTokeninUrl = function(req,res,next){
    // the check method need to write
    console.dir('the checkTokeninUrl method need to add!!!');
    req.user = {'id': mongoose.Types.ObjectId(req.query.user)};
    next();
  };

exports.checkTokeninBody = function(req,res,next){
    // the check method need to write
    console.dir('the checkTokeninBody method need to add!!!');
    req.user = {'id': mongoose.Types.ObjectId(req.body.user)};
    next();
  };

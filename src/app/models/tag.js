'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tag Schema
 */
var TagSchema = new Schema({
  tagName:{
    type: String,
    trim: true,
    required: 'Tag cannot be blank'
  },
  createdOn:{
    type: Date,
    default:Date.now
  },
  user:{
    type: Schema.ObjectId,
    ref: 'User'
  }
});
mongoose.model('Tag',TagSchema);

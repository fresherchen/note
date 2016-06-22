'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Notebook Schema
 */
var NotebookSchema = new Schema({
  notebookName:{
    type: String,
    default: '',
    trim: true,
    required: 'title cannot be blank'
  },
  createdOn:{
    type: Date,
    default:Date.now
  },
  isDefault:{
    type:Boolean,
    default:false
  },
  // notesNum:{
    // type:Number,
    // default:0
  // },
  user:{
    type:Schema.ObjectId,
    ref:'User'
  }
});
mongoose.model('Notebook',NotebookSchema);

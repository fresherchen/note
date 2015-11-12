'use strict';

/**
 * Module dependencies. 
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Note Schema 
 */
var NoteSchema = new Schema({
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	updatedOn: {
		type: Date,
		default: Date.now
	},
	notebookId: {
		type: String,
		required: true
	},
	inTrash: {
		type: Boolean,
		required: false
	},
	tag: {
		type: Array,
		required: false
	},
	size: {
		type: Number,
		// required: true
	},
	gid: {
		type: String,
		required: false
	},
	lid: {
		type:String,
		required: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});
mongoose.model('Note',NoteSchema);

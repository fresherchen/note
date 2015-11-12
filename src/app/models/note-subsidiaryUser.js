'use strict';

/**
 * Module dependencies. 
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subsidiary user Schema of note
 */
var SubsidiaryNoteUserSchema = new Schema({
	listmode : {
		type : String,
		// require : true
	},
	sortmode : {
		type : String,
		// require : true
	},
	usedsize : {
		type : Number,
		require : false
	},
	totalsize : {
		type : Number,
		require : false
	},
	_id : {
		type : Schema.ObjectId,
		ref : 'User'
	}
});
mongoose.model('SubsidiaryNoteUser',SubsidiaryNoteUserSchema);

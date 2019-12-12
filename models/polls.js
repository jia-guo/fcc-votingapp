let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let pollSchema = new Schema({
	author: {
		type: String,
		required: true
	},
	topic: {
		type: String,
		required: true,
		unique: true
	},
	options: {
		type: Array,
		required: true
	},
	postTime: {
		type: Date,
		default: Date.now
	},
	voteNum: {
		type: Number,
		default: 0
	},
	type: {
		type: String,
		default: 'public'
	}
})

module.exports = mongoose.model('Poll', pollSchema);
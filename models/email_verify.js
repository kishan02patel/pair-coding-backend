const mongoose = require('mongoose')
const { Schema } = mongoose
const { User } = require('./user')

mongoose.Promise = global.Promise

const emailVerifySchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: User,
		unique: true
	},
	token: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 86400
	}
})

const EmailVerify = mongoose.model('emailVerify', emailVerifySchema)

module.exports = {
	EmailVerify
}
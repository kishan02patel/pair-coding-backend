const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

mongoose.Promise = global.Promise

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['admin', 'user', 'moderator'],
		required: true,
		default: 'user'
	}
})

userSchema.pre('save', function (next) {
	if (this.isNew) {
		bcrypt.genSalt(10)
			.then(salt => {
				return bcrypt.hash(this.password, salt)
			})
			.then(hashedPassword => {
				this.password = hashedPassword
				next()
			})
			.catch(err => {
				console.log(err)
			})
	}
	else
		next()
})

userSchema.statics.matchUserCredentials = function (email, password) {
	// Get the reference of the userschema. It is not necessary. Instead of using 'this' we will use User 
	const User = this
	return User.findOne({ email })
		.then(user => {
			// If user exists
			if (user) {
				// Check password
				return bcrypt.compare(password, user.password)
					.then(isMatched => {
						// If password is correct resolve the Promise
						if (isMatched) {
							return Promise.resolve(user)
						}
						// If password is incorrect reject Promise
						else {
							return Promise.reject('Invalid email or password.')
						}
					})
					// If some error occurs while comparing password
					.catch(err => {
						return Promise.reject(err)
					})
			}
			// If email is not found then reject the Promise
			else {
				return Promise.reject('Invalid email or password.')
			}
		})
		// If some error occurs while finding the email.
		.catch(err => {
			return Promise.reject(err)
		})
}

const User = mongoose.model('users', userSchema)

module.exports = {
	User
}
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/config");
const validateLoginInput = require("../helpers/validations/login");
const validateRegisterInput = require("../helpers/validations/register");
const crypto = require('crypto')
const { EmailVerify } = require('../models/email_verify')
const sgMail = require('@sendgrid/mail')

router.post("/register", (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	if (!isValid) return res.status(400).send(errors);

	const newUser = new User(req.body);
	newUser
		.save()
		.then((userSavedResponse) => {
			// Create a random token and add to database
			let newVerify = new EmailVerify({ userId: userSavedResponse._id, token: crypto.randomBytes(16).toString('hex') })

			newVerify.save()
				.then((tokenSavedResponse) => {
					// Send email to the user for confirmation
					sendMail(newUser.name, newUser.email, newVerify.userId, newVerify.token)
				})
				.catch(err => {
					console.log(`Error while saving token: ${err}`)
					res.status(500).send(`Problem while sending verification email: ${err}`)
				})
			res.send({ success: "Success. Please verify your email address by clicking the link send to your email. PS. Check spam folder if you can't find it in inbox" });
		})
		.catch(err => res.send({ error: err }));
});

router.post("/login", (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	// Check validation passed or not
	if (!isValid) return res.status(400).send(errors);

	const email = req.body.email;
	const password = req.body.password;

	// Call a static user defined function on user model
	User.matchUserCredentials(email, password)
		.then(user => {
			// res.send({success: 'Logged in successfully.'})

			// Create a payload for jwt
			const payload = {
				id: user.id,
				name: user.name,
				role: user.role
			};

			// Generate a token which expires in 5 hours.
			jwt.sign(
				payload,
				JWT_SECRET_KEY,
				{ expiresIn: "5h" },
				(err, token) => {
					res.send({
						success: "Logged in successfully",
						// Create a Bearer token which will be used by passport to authenticate.
						token: "Bearer " + token
					});
				}
			);
		})
		.catch(err => {
			console.log(err);
			res.status(400).send({ error: err });
		});
});

router.get('/verifyemail', (req, res) => {
	let id = req.query.id
	let token = req.query.token

	EmailVerify.find({ userId: id, token: token })
		.then(response => {
			if (response) {
				User.findOneAndUpdate({ _id: id }, { $set: { isVerified: true } }, { new: true })
					.then(response => {
						console.log(`Set verified to true for used id ${id}`)
					})
					.catch(err => console.log(`Error while setting verified to true for used id ${id}`))
				res.status(200).send(`<h1>Email verified successfully. You can login now by going to <a href='${process.env.FRONTEND_URL}/login'>Login Page</a>.</h1>`)
			}
		})
		.catch(err => {
			console.log(`Error while finding user to verify email address ${id} ${token}`)
			res.status(400).send("No user found with matching token to verify email")
		})
})

function sendMail(name, email, userId, token) {
	sgMail.setApiKey(process.env.EMAIL_API_KEY);
	const msg = {
		to: email,
		from: 'no-reply@paircoding.com',
		subject: 'Email verification required',
		html: `<h1>Hi ${name}! Greetings from pair coding team.</h1>
		<br><p>Thank you for registering with us. Before you begin to start coding with your peers let's verify your email address first.</p><br>
		<strong>Verify your email address by clicking below link</strong><br><br>
		<a href="${process.env.BACKEND_URL}/users/verifyemail?id=${userId}&token=${token}">Verify Email</a><br><br>
		<p>Remember this link will expire after 24 hours.</p>`,
	};
	sgMail.send(msg)
		.then((response => console.log(`Confirmation email sent to ${name} - ${email}. Server response ${JSON.stringify(response)}`)))
		.catch(err => console.log(`Error while sending confirmation email to ${name} - ${email}. Server response ${err}`))
}

module.exports = {
	userRouter: router
};

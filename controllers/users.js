const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/config");
const validateLoginInput = require("../helpers/validations/login");
const validateRegisterInput = require("../helpers/validations/register");

router.post("/register", (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	if (!isValid) return res.status(400).send(errors);

	const newUser = new User(req.body);
	newUser
		.save()
		.then(() => {
			res.send({ success: "User registered successfully" });
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

module.exports = {
	userRouter: router
};

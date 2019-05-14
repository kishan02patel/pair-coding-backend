const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const { JWT_SECRET_KEY } = require("../../config/config");

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET_KEY
};

module.exports = passport => {
	passport.use(
		new JwtStrategy(options, (jwt_payload, done) => {
			User.findById(jwt_payload.id)
				.then(user => {
					if (user) return done(null, user);
					else return done(null, false);
				})
				.catch(err => {
					console.log(err);
					return done(err, false);
				});
		})
	);
};

const validator = require("validator");
const { isEmpty } = require("./custom");

module.exports = function validateRegisterInput(data) {
	let errors = {};

	// Call our own isEmpty function to check whether the field have values or not. This is done because the validator functions takes strings as an input.
	data.name = !isEmpty(data.name) ? data.name : "";
	data.email = !isEmpty(data.email) ? data.email : "";
	data.password = !isEmpty(data.password) ? data.password : "";

	if (!validator.isLength(data.name, { min: 2, max: 30 }))
		errors.name = "Name must be between 2 and 30 characters";

	if (validator.isEmpty(data.name))
		errors.name = "Name field cannot be empty";

	if (!validator.isEmail(data.email))
		errors.email = "Invalid email address";

	if (validator.isEmpty(data.email))
		errors.email = "Email field cannot be empty";

	if (!validator.isLength(data.password, { min: 8, max: 30 }))
		errors.password = "Password should be between 8 and 30 characters";

	if (validator.isEmpty(data.password))
		errors.password = "Password field cannot be empty";

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

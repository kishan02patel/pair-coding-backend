const validator = require("validator");
const { isEmpty } = require("./custom");

const validateLoginInput = data => {
	let errors = {};

	//Call our own isEmpty function to check whether the field have values or not. This is done because the validator fucntion takes only strings as as input. So if value is not defined then it will not work.

	data.email = !isEmpty(data.email) ? data.email : "";
	data.password = !isEmpty(data.password) ? data.password : "";

	if (!validator.isEmail(data.email))
		errors.email = "Invalid email address";

	if (validator.isEmpty(data.email))
		errors.email = "Email field cannot be empty";

	if (validator.isEmpty(data.password))
		errors.password = "Password field cannot be empty";

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

module.exports = validateLoginInput;

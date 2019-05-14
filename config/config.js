const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/pair-coding";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "Secret@123#";

module.exports = {
	PORT,
	DB_URL,
	JWT_SECRET_KEY
};

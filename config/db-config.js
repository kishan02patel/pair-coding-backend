const mongoose = require("mongoose");
const { DB_URL } = require("./config");

mongoose
	.connect(DB_URL, { useNewUrlParser: true })
	.then(() => console.log("Connected to DB"))
	.catch(err => console.log(err));

const dotenv = require("dotenv");
dotenv.config();

exports.config = {
	PORT: process.env.PORT,
	HOST: process.env.HOST,
	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

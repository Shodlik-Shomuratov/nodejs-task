const { verify } = require("jsonwebtoken");
const { config } = require("../utils/config");
const userModel = require("../models/user.model");

async function verifyUser(req, res, next) {
	try {
		const token = req.headers?.authorization?.split(" ")[1];

		if (!token) {
			return res.status(400).json({
				data: null,
				message: null,
				error: true,
				errorMessage: "JWT required!",
			});
		}

		const decryptToken = verify(token, config.JWT_SECRET_KEY);

		const user = await userModel.getByEmail(decryptToken.email);

		if (!user) {
			return res.status(400).json({
				data: null,
				message: null,
				error: true,
				errorMessage: "Unauthorized user!",
			});
		}

		req.user = {
			id: user.id,
			firstName: user.firstName,
			email: user.email,
		};

		next();
	} catch (error) {
		if (error.message === "jwt malformed") {
			return res.status(400).json({
				data: null,
				message: null,
				error: true,
				errorMessage: "Invalid JWT token!",
			});
		} else if (error.message === "jwt expired") {
			return res.status(400).json({
				data: null,
				message: null,
				error: true,
				errorMessage: "Expired JWT token!",
			});
		}
		next(error);
	}
}

module.exports = {
	verifyUser,
};

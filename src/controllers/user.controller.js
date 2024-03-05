const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const {
	registerSchema,
	loginSchema,
} = require("../utils/validators/user.validator");
const userModel = require("../models/user.model");
const { config } = require("../utils/config");

async function login(req, res, next) {
	try {
		const { error, value } = loginSchema.validate(req.body);

		if (error) {
			return res.status(400).json({
				data: null,
				message: null,
				error: true,
				errorMessage: error.details[0].message,
			});
		}

		const user = await userModel.getByEmail(value.email);

		if (!user) {
			return res.status(404).json({
				data: null,
				message: null,
				error: true,
				errorMessage: "User not found!",
			});
		}

		const isValid = await compare(value.password, user.passwordHash);

		if (!isValid) {
			return res.status(400).json({
				data: null,
				message: null,
				error: true,
				errorMessage: "Wrong password!",
			});
		}

		const accessToken = sign(
			{
				id: user.id,
				email: user.email,
			},
			config.JWT_SECRET_KEY,
			{
				expiresIn: "1h",
			}
		);

		return res.status(200).json({
			data: {
				accessToken,
			},
			message: "Login successfully!",
			error: false,
			errorMessage: null,
		});
	} catch (error) {
		next(error);
	}
}

async function register(req, res, next) {
	try {
		const { error, value } = registerSchema.validate(req.body);

		if (error) {
			return res.status(400).json({
				data: null,
				message: null,
				error: true,
				errorMessage: error.details[0].message,
			});
		}

		const user = await userModel.register(value);

		return res.status(201).json({
			data: exclude(user, ["passwordHash"]),
			message: "User created!",
			error: false,
			errorMessage: null,
		});
	} catch (error) {
		if (error.message.split(" ").includes("`User_email_key`")) {
			return res.status(400).json({
				data: null,
				message: null,
				error: true,
				errorMessage: "This email is already in use!",
			});
		}

		next(error);
	}
}

function exclude(user, keys) {
	return Object.fromEntries(
		Object.entries(user).filter(([key]) => !keys.includes(key))
	);
}

module.exports = {
	login,
	register,
};

const fs = require("node:fs/promises");
const path = require("path");
const userModel = require("../models/user.model");
const { config } = require("../utils/config");
const { updateSchema } = require("../utils/validators/user.validator");

async function update(req, res) {
	const id = Number(req.params.id);
	const profile = await userModel.getById(id);

	if (!profile) {
		return res.status(404).json({
			data: null,
			message: null,
			error: true,
			errorMessage: "Profile not found!",
		});
	}

	const { error, value } = updateSchema.validate(req.body);

	if (error) {
		await fs.unlink(
			path.join(
				path.dirname(path.dirname(__dirname)),
				"public",
				"images",
				req.fileName
			)
		);

		return res.status(400).json({
			data: null,
			message: null,
			error: true,
			errorMessage: error.details[0].message,
		});
	}

	const imageUrl =
		"http://" + config.HOST + ":" + config.PORT + "/images/" + req.fileName;

	const updatedProfile = await userModel.updateById(id, {
		...value,
		imageUrl,
	});

	return res.status(200).json({
		data: exclude(updatedProfile, ["passwordHash"]),
		message: "Updated successfully!",
		error: false,
		errorMessage: null,
	});
}

async function getOne(req, res) {
	const id = Number(req.params.id);

	const profile = await userModel.getById(id);

	if (!profile) {
		return res.status(404).json({
			data: null,
			message: null,
			error: true,
			errorMessage: "Profile not found!",
		});
	}

	return res.status(200).json({
		data: exclude(profile, ["passwordHash"]),
		message: "Fetched successfully!",
		error: false,
		errorMessage: null,
	});
}

async function getAll(req, res) {
	const page = Number(req.query?.page) || 1;
	const limit = Number(req.query?.limit) || 10;
	const data = await userModel.getAll(page, limit);

	const profiles = data.profiles.map((profile) => {
		return exclude(profile, ["passwordHash"]);
	});

	return res.status(200).json({
		data: {
			page,
			limit,
			totalPage: data.totalPages,
			profiles,
		},
		message: "Fetched successfully!",
		error: false,
		errorMessage: null,
	});
}

function exclude(user, keys) {
	return Object.fromEntries(
		Object.entries(user).filter(([key]) => !keys.includes(key))
	);
}

module.exports = {
	update,
	getOne,
	getAll,
};

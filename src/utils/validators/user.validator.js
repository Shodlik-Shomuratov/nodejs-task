const { Gender } = require("@prisma/client");
const JOI = require("joi");

const registerSchema = JOI.object({
	firstName: JOI.string().min(3).max(100).alphanum().required(),
	email: JOI.string().email().required(),
	password: JOI.string().min(3).max(30).required(),
});

const loginSchema = JOI.object({
	email: JOI.string().email().required(),
	password: JOI.string().min(3).max(30).required(),
});

const updateSchema = JOI.object({
	firstName: JOI.string().min(3).max(100).alphanum(),
	lastName: JOI.string().min(3).max(100).alphanum(),
	email: JOI.string().email(),
	gender: JOI.string().valid(Gender.MALE, Gender.FEMALE, Gender.NONE),
});

module.exports = {
	registerSchema,
	loginSchema,
	updateSchema,
};

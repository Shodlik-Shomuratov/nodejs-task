const prisma = require("../database/prisma");
const { hash } = require("bcryptjs");

async function register(body) {
	const passwordHash = await hash(body.password, 10);

	delete body.password;

	const user = await prisma.user.create({
		data: {
			...body,
			passwordHash,
		},
	});

	return user;
}

async function getAll(page, limit) {
	const profilesCount = await prisma.user.count();

	const totalPages = Math.ceil(profilesCount / limit);

	const profiles = await prisma.user.findMany({
		skip: (page - 1) * limit,
		take: limit,
		orderBy: [
			{
				createdAt: "desc",
			},
		],
	});

	return {
		totalPages,
		profiles,
	};
}

async function getById(id) {
	return await prisma.user.findFirst({
		where: {
			id,
		},
	});
}

async function getByEmail(email) {
	return await prisma.user.findFirst({
		where: {
			email,
		},
	});
}

async function updateById(id, body) {
	return await prisma.user.update({
		where: {
			id,
		},
		data: body,
	});
}

module.exports = {
	register,
	getAll,
	getById,
	getByEmail,
	updateById,
};

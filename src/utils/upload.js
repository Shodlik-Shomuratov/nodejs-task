const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images");
	},
	filename: (req, file, cb) => {
		const fileName = Date.now() + "-" + file.originalname;
		req.fileName = fileName;
		cb(null, fileName);
	},
});

module.exports = {
	upload: multer({
		storage,
		limits: {
			fileSize: 10000000, // 10 MB
			fileFilter: (req, file, cb) => {
				if (
					file.mimetype === "image/jpeg" ||
					file.mimetype === "image/png"
				) {
					cb(null, true);
				} else {
					cb(new Error("Invalid file type"));
				}
			},
		},
	}),
};

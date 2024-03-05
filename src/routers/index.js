/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const profileController = require("../controllers/profile.controller");
const { verifyUser } = require("../middlewares/verifyUser");
const { upload } = require("../utils/upload");

// User route
router.post("/user/login", userController.login); // done
router.post("/user/register", userController.register); // done

// Profile route
router.get("/profiles", verifyUser, profileController.getAll);
router.get("/profile/:id", verifyUser, profileController.getOne);
router.put(
	"/profile/:id",
	verifyUser,
	upload.single("image"),
	profileController.update
);

module.exports = router;

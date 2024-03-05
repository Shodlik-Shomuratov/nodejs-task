const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const { config } = require("./utils/config");
const indexRouter = require("./routers/index");

// Third party middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use("/", express.static("public"));

// Routers
app.use("/", indexRouter);

// Error handler
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).json({
		message: "Internal Server Error",
	});
});

const HOST = config.HOST;
const PORT = config.PORT || 3001;

app.listen(PORT, HOST, () => {
	console.log(`Server listening on port ${PORT}`);
});

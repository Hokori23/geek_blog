const EXPRESS = require("express");
// const PATH = require("path");
// const LOGGER = require("morgan");

const INDEX_ROUTER = require("./routes/index");
const USERS_ROUTER = require("./routes/users");

const APP = express();

// APP.use(LOGGER("dev"));
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: false }));
// app.use(express.static(PATH.join(__dirname, 'public')));

APP.use("/", INDEX_ROUTER);
APP.use("/users", USERS_ROUTER);

module.exports = APP;
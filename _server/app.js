"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _routes_1 = require("./routes");
var EXPRESS = require('express');
// const PATH = require("path");
// const LOGGER = require("morgan");
var APP = EXPRESS();
//parse application/x-www-form-urlencoded
APP.use(EXPRESS.urlencoded({ extended: true }));
//parse application/json
APP.use(EXPRESS.json());
// APP.use(LOGGER("dev"));
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: false }));
// app.use(express.static(PATH.join(__dirname, 'public')));
APP.use('/', _routes_1.Home);
APP.use('/user', _routes_1.User);
module.exports = APP;

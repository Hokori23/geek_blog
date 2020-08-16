import { Home as HomeRouter, User as UserRouter } from '@routes';

const EXPRESS = require('express');
// const PATH = require("path");
// const LOGGER = require("morgan");

const APP = EXPRESS();

//parse application/x-www-form-urlencoded
APP.use(EXPRESS.urlencoded({ extended: true }))
//parse application/json
APP.use(EXPRESS.json())


// APP.use(LOGGER("dev"));
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: false }));
// app.use(express.static(PATH.join(__dirname, 'public')));

APP.use('/', HomeRouter)
APP.use('/user', UserRouter);

module.exports = APP;

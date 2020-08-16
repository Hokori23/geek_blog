"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EXPRESS = require('express');
var ROUTER = EXPRESS.Router();
/* GET home page. */
ROUTER.get('/', function (req, res, next) {
    res.status(200).json({
        code: 0,
        message: 'Home'
    });
});
exports.default = ROUTER;

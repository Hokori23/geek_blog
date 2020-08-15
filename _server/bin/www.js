#!/usr/bin/env node
"use strict";
var bin;
(function (bin) {
    /**
     * Config import
     */
    var serverConfig = require('../../geekblog.config.js').serverConfig;
    /**
     * Module dependencies.
     */
    var APP = require('../app');
    var DEBUG = require('debug')('server:server');
    var HTTP = require('http');
    /**
     * Get port from environment and store in Express.
     */
    var PORT = normalizePort(process.env.PORT || serverConfig.port);
    APP.set('port', PORT);
    /**
     * Create HTTP server.
     */
    var SERVER = HTTP.createServer(APP);
    /**
     * Listen on provided port, on all network interfaces.
     */
    SERVER.listen(PORT, function () {
        console.log("\u670D\u52A1\u5668\u5F00\u59CB\u76D1\u542C " + PORT + " \u7AEF\u53E3\uFF01");
    });
    SERVER.on('error', onError);
    SERVER.on('listening', onListening);
    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            // named pipe
            return val;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return false;
    }
    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : '端口 ' + PORT;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' 需要更高权限');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' 已被占用');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
        var addr = SERVER.address();
        var bind = typeof addr === 'string' ? 'pipe ' + addr : '端口 ' + addr.port;
        DEBUG('正在监听' + bind);
    }
})(bin || (bin = {}));

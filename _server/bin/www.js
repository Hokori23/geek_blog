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
        console.log("listening on port " + PORT + "!");
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
        var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
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
        var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        DEBUG('Listening on ' + bind);
    }
})(bin || (bin = {}));

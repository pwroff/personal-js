'use strict';

const express = require('express');
const fs = require('fs');

const app = express();

app.use('/build', express.static('build'));

app.get('/', function(req, res){
    const src = process.cwd()+'/index.html';
    const index = src;
    res.sendFile(index);
});

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

class Server {
    constructor(port = '3660'){
        this.app = app;
        this.port = normalizePort(port);
    }

    start() {
        this.app.listen(this.port);
        console.log(`server Listening on port ${this.port}`);
    }
}

module.exports = Server;

'use strict';

const express = require('express');
const fs = require('fs');
const routesPath = process.cwd()+'/src/routes/';

const app = express();

app.use('/build', express.static('build'));

app.get('/', function(req, res){
    const src = process.cwd()+'/index.html';
    res.sendFile(src);
});

const checkedRoutes = {};

const checkRoutes = (app)=>{
    return new Promise((resolve, reject) => {
        fs.readdir(routesPath, (err, data)=>{

            if  (err) reject();

            const availableRoutes = {};

            data.map((v, i)=>{

                if (checkedRoutes[v]) return;

                try {
                    const curr = require(routesPath+v);
                    availableRoutes[v] = curr;
                    console.log(`Route /${v} loaded`);
                } catch(e) {
                    console.log('Unable to load route module');
                }
            });

            for (const route of Object.keys(availableRoutes)) {
                app.use(`/${route}`, availableRoutes[route]);
                checkedRoutes[route] = true;
            }
            resolve();
        });
    });
};

class Server {

    static normalizePort(val) {
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

    constructor(port = '3660'){
        this._app = app;
        this._port = Server.normalizePort(port);
    }

    start() {
        checkRoutes(this._app).then(()=>{
            this._app.listen(this._port);
            console.log(`server Listening on port ${this._port}`);
        }).catch((e)=>{
            console.log(`Error while starting a server`, e);
        });

    }

    refreshRoutes() {
        return checkRoutes(this._app);
    }
}

module.exports = Server;

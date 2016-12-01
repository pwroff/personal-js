'use strict';

const express = require('express');
const fs = require('fs');
const routesPath = process.cwd()+'/src/routes/';
const ReactDOM = require('react-dom/server');
const React = require('react');
const Html = require('../../components/Html');

const app = express();

app.use('/build', express.static('build'));

app.get('/', function(req, res){
    const data = {
        head: [
            {
                element: 'link',
                attributes: {
                    rel: 'stylesheet',
                    href: '/build/css/style.css'
                }
            }
        ]
    };
    const bundle =  '/build/js/bundle.js';
    const html = ReactDOM.renderToStaticMarkup(React.createElement(Html, {data, bundle}));
    res.status(200);
    res.send(`<!doctype html>${html}`);
});

const checkedRoutes = {};

const checkData = (data)=>{
    return new Promise((resolve, reject)=>{
        const availableRoutes = {};
        const checker = (i)=>{
            if (i == data.length) {
                resolve(availableRoutes);
            } else {
                const v = data[i];
                if (checkedRoutes[v]) {
                    checker(i+1);
                }


                try {
                    const curr = require(routesPath+v);

                    if (curr instanceof Promise) {
                        curr().then((r)=>{

                            availableRoutes[v] = r;
                            console.log(`Async Route /${v} loaded`);
                            checker(i+1);
                        })
                    } else {
                        availableRoutes[v] = curr;
                        console.log(`Route /${v} loaded`);
                        checker(i+1);
                    }
                } catch(e) {
                    console.log(`Unable to load ${v} route module`, e);
                    checker(i+1);
                }
            }
        };
        checker(0);
    });
}

const checkRoutes = (app)=>{
    return new Promise((resolve, reject) => {
        fs.readdir(routesPath, (err, data)=>{

            if  (err) reject();

            checkData(data).then((availableRoutes)=>{
                for (const route of Object.keys(availableRoutes)) {
                    app.use(`/${route}`, availableRoutes[route]);
                    checkedRoutes[route] = true;
                }

                resolve();
            });

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

'use strict';

const express = require('express');
const fs = require('fs');
const routesPath = process.cwd()+'/src/routes/';
const ReactDOM = require('react-dom/server');
const React = require('react');
const Html = require('../../components/Html');

const app = express();

const getHtml = (bundle = '/build/js/bundle.js')=>{
    const data = {
        head: [
            {
                element: 'meta',
                attributes: {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, user-scalable=no'
                }
            },
            {
                element: 'link',
                attributes: {
                    rel: 'stylesheet',
                    href: '/build/css/style.css'
                }
            }
        ]
    };
    const links = [
        React.createElement('a', {key: 'home', className:'playgroundLink', href: `/`}, 'home')
    ];

    for (let l of Object.keys(checkedRoutes)) {
        links.push(
            React.createElement('a', {key: l, className:'playgroundLink', href: `/${l}`}, l)
        )
    }

    data.body = React.createElement('nav', {}, links);

    return ReactDOM.renderToStaticMarkup(React.createElement(Html, {data, bundle}));
};

app.use('/build', express.static('build'));

app.get('/', function(req, res){

    res.status(200);
    res.send(`<!doctype html>${getHtml()}`);
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

    static getHtml(...all) {
        return getHtml(...all)
    }

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

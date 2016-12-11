/**
 * Created by Leonid on 30/11/16.
 */
const Server = require('./src/core/server');
const s = new Server(process.env.PORT);
const jsBundler = require('./tools/jsBundler');
s.start();

const watch = process.argv.indexOf('--w');
if (watch != -1) {
    const params = process.argv.slice(watch+1),
        name = params[0];

    const src = `./src/routes/${name}/application.js`,
        target = `./build/js/${name}_bundle.js`;

    try {
        jsBundler.watchScripts(src, target);
    } catch(e) {
        console.log(`Unable to start watcher with params ${name}`);
        console.log(e.message);
    }
}

/**
 * Created by Leonid on 30/11/16.
 */
const Server = require('./src/core/server');
const s = new Server(process.env.PORT);
const jsBundler = require('./tools/jsBundler');
s.start();

const watch = process.argv.indexOf('--w');
if (watch != -1) {
    const params = process.argv.slice(watch+1);
    jsBundler.watchScripts(params[0], params[1]);
}

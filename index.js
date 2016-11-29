/**
 * Created by Leonid on 30/11/16.
 */
const Server = require('./src/core/server');
const s = new Server(process.env.PORT);
s.start();

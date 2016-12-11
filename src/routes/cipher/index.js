/**
 * Created by Leonid on 30/11/16.
 */

const Router = require('../../core/router/Router');
const router = new Router();
const {getHtml} = require('../../core/server/server');

router.use(function timeLog(req, res, next) {
    console.log('Cipher enter Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function(req, res) {
    const bundle =  '/build/js/cipher_bundle.js';
    const html = getHtml(bundle);
    res.status(200);
    res.send(`<!doctype html>${html}`);
});


module.exports = router;

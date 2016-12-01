/**
 * Created by Leonid on 30/11/16.
 */

const Router = require('../../core/router/Router');
const router = new Router();
const ReactDOM = require('react-dom/server');
const React = require('react');
const Html = require('../../components/Html');
const jsBundler = require('../../../tools/jsBundler');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function(req, res) {
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
    const bundle =  '/build/js/webaudio_bundle.js';
    const html = ReactDOM.renderToStaticMarkup(React.createElement(Html, {data, bundle}));
    res.status(200);
    res.send(`<!doctype html>${html}`);
});
// define the about route
router.get('/about', function(req, res) {
    res.send('About bla');
});


module.exports = router;

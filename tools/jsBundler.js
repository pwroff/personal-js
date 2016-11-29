'use strict';

const browserify = require('browserify');
const watchify = require('watchify');
const UglifyJS = require('uglify-js');
const fs = require('fs');

const transforms = [
    'envify',
    [
        'babelify',
        {
            "presets": [
                "es2015",
                "react",
                "stage-0"
            ],
            "plugins": ["transform-object-assign"]

        }
    ]
];

const bundleProps = {
    debug: true,
    transform: transforms
};

const bundleStream = function (bundler, filepath) {

    function rebundle() {

        var destination = fs.createWriteStream(filepath);
        var stream = bundler.bundle();

        stream.once('error', (err) => {
            console.log('Error compiling a file: ', err.message);
        });

        return stream.pipe(destination);
    }

    bundler.on('update', function () {
        rebundle();
        console.log('Rebundle...');
    });
    bundler.on('log', function (msg) {
        console.log(msg);
    });

    return rebundle();
};

module.exports = {
    buildScripts: function buildJs(jsfile = './src/application.js', path = './build/js/bundle.js', callback) {
        console.log('Building scripts...');
        const b = browserify(jsfile, bundleProps);
        b.on('file', function (file) {
            console.log(`Bundling file ${file};`);
        });
        b.bundle(function (err, file) {
            if (err !== null) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Minifying scripts`);
            var minified = UglifyJS.minify("" + file, {fromString: true});
            fs.writeFile(path, minified.code, (err) => {
                if (err !== null) {
                    console.error(err);
                    process.exit(1);
                }
                console.log(`JS files builded successfull to ${path}`);
                if (typeof callback === 'function') {
                    callback();
                } else {
                    process.exit(0);
                }
            });
        });
    },
    watchScripts: function watchJs(jsfile = './src/application.js', path = './build/js/bundle.js') {
        let props = bundleProps;
        props = Object.assign(props, {
            cache: {},
            packageCache: {},
            plugin: [watchify],
            entries: [jsfile],
            ignoreWatch: ['**/node_modules/**']
        });
        const b = browserify(jsfile, props);
        bundleStream(b, path);
    }
};

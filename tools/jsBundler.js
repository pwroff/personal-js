'use strict';

const browserify = require('browserify');
const watchify = require('watchify');
const UglifyJS = require('uglify-js');
const fs = require('fs');

const routesPath = './src/routes';
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

const writeFile = (path, source, callback) => {
    fs.writeFile(path, source, (err)=>{
            if (err !== null) {
                console.error(err);
                process.exit(1);
            }
            console.log(`JS files builded successfull to ${path}`);
            if (typeof callback === 'function') {
                callback(source);
            } else {
                process.exit(0);
            }
        }
    );
};

const processJs = (jsfile, cb = ()=>{})=>{
    const b = browserify(jsfile, bundleProps);
    b.bundle(function (err, file) {
        if (err !== null) {
            console.error(err);
            process.exit(1);
        }
        var minified = UglifyJS.minify("" + file, {fromString: true});
        cb(minified);
    })
};

const checkData = (data) => {

    return new Promise((resolve, reject) => {
        const check = (i)=>{
            if (i == data.length) {
                resolve();
            }
            else {
                const curr = `${routesPath}/${data[i]}/application.js`;
                processJs(curr, (minified)=>{
                    writeFile(`./build/js/${data[i]}_bundle.js`, minified.code, check.bind(undefined, i+1));
                });
            }
        };

        check(0);
    });
};

const checkRoutesFolder = () => {

    return new Promise((resolve, reject) => {
        fs.readdir(routesPath, (err, data)=>{

            if (err) {
                console.error(err);
                process.exit(1);
            }

            const exist = [];

            data.map((e, i)=> {
                const curr = `${routesPath}/${e}/application.js`;
                const exists = fs.existsSync(curr);
                console.log(curr, exists);
                if (exists) {
                    exist.push(e);
                }
            });

            resolve(exist);

        });
    });

};

module.exports = {
    buildScripts: function buildJs(jsfile = './src/application.js', path = './build/js/bundle.js', callback) {
        console.log('Building scripts...');
        checkRoutesFolder().then((data)=> {
            checkData(data).then(()=> {
                processJs(jsfile, (minified)=> {
                    writeFile(path, minified.code, callback);
                });
            });
        });

    },
    watchScripts: function watchJs(jsfile = './src/application.js', path = './build/js/bundle.js') {
        const entries = [jsfile];
        let props = bundleProps;
        props = Object.assign(props, {
            plugin: [watchify],
            entries,
            ignoreWatch: ['**/node_modules/**']
        });
        const b = browserify(jsfile, props);
        bundleStream(b, path);
    },
    compile: processJs
};

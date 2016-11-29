'use strict';
const less = require('less');
const fs = require('fs');

module.exports = {
    buildLess: function (input = 'src/assets/less/main.less', output = '/build/css/style.css', callback) {
        var options = {
            compress: true,
            filename: input
        };
        var file = fs.readFileSync(input, 'utf8');
        console.log("Compiling less files");
        less.render(file, options, function (error, data) {
            console.log("Writing css data");
            fs.writeFile('.' + output, data.css, function (err) {
                if (err !== null) {
                    console.error(err);
                    process.exit(1);
                }
                console.log(`LESSS files builded successfull to ${output}`);
                if (typeof callback === 'function') {
                    callback();
                }
            });
        })
    },
    watchLess: function (input, output) {
        this.buildLess(input, output, () => {
            console.log('watching less changes');
            fs.watch('src/assets/less', {persistent: true, recursive: true}, (event, filename) => {
                if (filename.endsWith('less')) {
                    console.log(`Rebuilding...`);
                    this.buildLess(input, output);
                }
            });
        });
    }
};

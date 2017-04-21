const fs = require('fs');
const crypto = require('crypto');
const write = (path, data, encoding = 'utf8') => new Promise((resolve, reject) => {
    fs.writeFile(path, data, encoding, (err) => {
        if (err) {
            return reject(err);
        }
        return resolve();
    })
});
const read = (path, encoding = 'utf8') => new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
        if (err) {
            return reject(err);
        }
        return resolve(data);
    })
});
module.exports.write = write;
module.exports.read = read;
module.exports.init = (ts = 15) => {
    return new Promise((resolve, reject) => {
        const tokens = [];
        for (let i = 0; i < ts; i++) {
            const bt = crypto.randomBytes(8);
            tokens.push(bt.toString('hex'));
        }
        write('./tokens.json', JSON.stringify({
            data: tokens
        }, null, 4)).then(()=>{
            resolve(tokens);
        });
    });
}
import libFs from 'fs';
import libPath from 'path';

let stringify = (str) => {
    if (typeof str === 'string') { return str; }
    if (str.toString() === '[object Object]') {
        str = JSON.stringify(str);
    }
    else {
        str = str.toString();
    }

    return str;
};

let
    warn = (msg) => {
        msg = stringify(msg);
        console.warn(`[WARN] ${msg}`.yellow);
    },
    error = (msg) => {
        msg = stringify(msg);
        console.error(`[ERROR] ${msg}`.bold.red);
    },
    readAsync = (path) => {
        return new Promise((resolve, reject) => {
            try{
                let data,
                    isExists = libFs.existsSync(path);
                if(isExists) {
                    data = libFs.readFileSync(path);
                }
                else {
                    data = null;
                }
                resolve(data);
            }
            catch(e) {
                reject(e);
            }
        });
    },
    writeAsync = (path, data) => {
        return new Promise((resolve, reject) => {
            try{
                let dir = libPath.dirname(path);
                if(!libFs.existsSync(dir)) {
                    libFs.mkdirSync(dir);
                }
                libFs.writeFileSync(path, data);
                resolve();
            }
            catch(e) {
                reject(e);
            }
        });
    };

export { warn, error, readAsync, writeAsync };

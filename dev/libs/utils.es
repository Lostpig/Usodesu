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
let assign = (target, ...items) => {
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
    }
    let to = Object(target);
    for(let [i,v] of items.entries()) {
        if(v === undefined || v === null) {
            continue;
        }
        v = Object(v);

        let keyArr = Object.keys(v);
        for (let nextIndex = 0, len = keyArr.length; nextIndex < len; nextIndex++) {
            let nextKey = keyArr[nextIndex];
            let desc = Object.getOwnPropertyDescriptor(v, nextKey);
            if (desc !== undefined && desc.enumerable) {
                to[nextKey] = v[nextKey];
            }
        }
    }
    return to;
};
if(!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable  : false,
        configurable: true,
        writable    : true,
        value       : assign
    });
}

let
    warn = (msg) => {
        msg = stringify(msg);
        console.warn(`[WARN] ${msg}`);
    },
    error = (msg) => {
        msg = stringify(msg);
        console.error(`[ERROR] ${msg}`);
    },
    log = (msg) => {
        msg = stringify(msg);
        console.log(`[LOG]${msg}`);
    },
    readAsync = async (path) => {
        let data,
            isExists = libFs.existsSync(path);
        if(isExists) {
            data = libFs.readFileSync(path);
        }
        else {
            data = null;
        }
        return data;
    },
    writeAsync = async (path, data) => {
        let dir = libPath.dirname(path);
        if(!libFs.existsSync(dir)) {
            libFs.mkdirSync(dir);
        }
        libFs.writeFileSync(path, data);
        return true;
    };

export { warn, error, log, readAsync, writeAsync, assign };

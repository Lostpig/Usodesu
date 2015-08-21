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


let warn = (msg) => {
        msg = stringify(msg);
        console.warn(`[WARN] ${msg}`.yellow);
    },
    error = (msg) => {
        msg = stringify(msg);
        //console.error(`[ERROR] ${msg}`.bold.red);
        console.log(`custom ERROR: ${msg}`);
    };

export { warn, error };

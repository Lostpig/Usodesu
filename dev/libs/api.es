import EventEmitter from 'events';
import zlib from 'zlib';

let unzip = (data, encoding) => {
    return new Promise((resolve, reject) => {
        if(encoding === 'gzip') {
            zlib.gunzip(data, (err, body) => {
                if(err) { reject(err); }
                else { resolve(body); }
            });
        }
        else if(encoding === 'deflate') {
            zlib.inflate(data, (err, body) => {
                if(err) { reject(err); }
                else { resolve(body); }
            });
        }
        else {
            resolve(data);
        }
    });
};

class Api extends EventEmitter{
    constructor() {
        super();
        this.store = {};
    }
    set(body, encoding) {
        unzip(body, encoding).then((data) => {
            data = data.toString();
            if(data.startsWith('svdata=')) { data = data.substring(7); }
            let decodedata = JSON.parse(decodedata);
            
        });
    }
}

export default new Api();

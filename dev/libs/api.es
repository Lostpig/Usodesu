import EventEmitter from 'events';
import zlib from 'zlib';
import {log, error, warn} from './utils';

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

let apiEvent = {
    '/kcsapi/api_start2': 'start'
}

class Api extends EventEmitter{
    constructor() {
        super();
    }
    async process(path, reqbody, resbody, encoding) {
        try{
            if(apiEvent[path]) {
                let data = await unzip(resbody, encoding);
                data = data.toString();
                if(data.startsWith('svdata=')) { data = data.substring(7); }

                this.emit(apiEvent[path], resbody.toString(), data);
            }
            else {
                warn(`apiEvent: ${path} is not alivable`);
            }
        }
        catch(e) {
            error(e);
        }
    }
}

export default new Api();

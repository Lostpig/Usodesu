import libHttp from 'http';
import libUrl from 'url';
import libNet from 'net';
import libFs from 'fs';
import libPath from 'path';
import libRequest from 'request';
import libMime from 'mime';
import EventEmitter from 'events';
import {error, readAsync, writeAsync} from './utils';
import config from './config';
import api from './api';

let
    toRequest = (req) => {
        return new Promise((resolve, reject) => {
            let reqbody = new Buffer(0);
            req.on('data', (d) => {
                reqbody = Buffer.concat([reqbody, d]);
            }).on('end', () => {
                let option = {
                    method        : req.method,
                    url           : req.url,
                    headers       : req.headers,
                    encoding      : null,
                    followRedirect: false,
                    proxy         : 'http://127.0.0.1:3213'
                };
                if (reqbody.length > 0) {
                    option = Object.assign(option, { body: reqbody });
                }

                libRequest(option, (err, response, resbody) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(response, resbody);
                    }
                });
            }).on('error', (e) => {
                reject(e);
            });
        });
    },
    processResource = (req, res) => {
        let url = libUrl.parse(req.url);
        let path = libPath.join(config.cachefolder, url.pathname);
        if(libFs.existsSync(path)) {
            let state = libFs.statSync(path);
            if(req.headers['if-modified-since'] && (new Date(req.headers['if-modified-since']) >= state.mtime)){
                res.writeHead(304, {
                    'Server'       : 'nginx',
                    'Last-Modified': state.mtime.toGMTString()
                });
                res.end();
            }
            else {
                readAsync(path).then((data) => {
                    res.writeHead(200, {
                        'Server'        : 'Apache',
                        'Content-Length': data.length,
                        'Content-Type'  : libMime.lookup(path),
                        'Last-Modified' : state.mtime.toGMTString()
                    });
                    res.end(data);
                });
            }
        }
        else {
            toRequest(req).then((response, resBody) => {
                res.writeHead(response.statusCode, response.header);
                res.end(resBody);

                writeAsync(path, resBody).catch((e) => { error(e); });
            }).catch((e) => {
                error(e);
            });
        }
    },
    processApi = (req, res) => {
        toRequest(req).then((response, resBody) => {
            res.writeHead(response.statusCode, response.header);
            res.end(resBody);

            if(response.statusCode === '200') {
                api.set(resBody, response.headers['content-encoding']);
            }
        }).catch((e) => {
            error(e);
        });
    },
    processOther = (req, res) => {
        toRequest(req).then((response, resBody) => {
            res.writeHead(response.statusCode, response.header);
            res.end(resBody);
        });
    };

class Proxy extends EventEmitter {
    constructor(port) {
        super();
        this.load(port);
    }
    load(port) {
        this.server = libHttp.createServer();
        this.server.on('request', (req, res) => {
            delete req.headers['proxy-connection'];
            req.headers.connection = 'close';

            let reqUrl = libUrl.parse(req.url);

            if (reqUrl.pathname.startsWith('/kcs/')) {
                processResource(req, res);
            }
            else if(reqUrl.pathname.startsWith('/kcsapi')) {
                processApi(req, res);
            }
            else {
                processOther(req, res);
            }
        });

        this.server.on('connect', (req, client, head) => {
            delete req.headers['proxy-connection'];
            req.headers.connection = 'close';

            let remoteUrl = libUrl.parse(`https://${req.url}`);
            let remote = libNet.connect(remoteUrl.port, remoteUrl.hostname, () => {
                remote.write(head);
                client.write('HTTP/1.1 200 Connection Established\r\nConnection: close\r\n\r\n');
                remote.pipe(client);
                client.pipe(remote);
            });

            remote.on('end', () => { client.end(); });
            client.on('end', () => { remote.end(); });
            remote.on('timeout', () => { remote.destroy(); client.destroy(); });
            client.on('timeout', () => { remote.destroy(); client.destroy(); });
            remote.on('error', (e) => { error(e); client.destroy(); });
            client.on('error', (e) => { error(e); remote.destroy(); });
        });

        this.server.listen(port, () => {
            console.log(`proxy listen on ${port}`);
        });
    }
}

//new Proxy(12450);
export default new Proxy(12450);

import libHttp from 'http';
import libUrl from 'url';
import libNet from 'net';
import EventEmitter from 'events';
import {error} from './utils';

let toRequest = (req) => {
        return new Promise((resolve, reject) => {
            let reqbody = new Buffer(0);
            req.on('data', (d) => {
                reqbody = Buffer.concat([reqbody, d]);
            }).on('end', () => {
                let option = {
                    method  : req.method,
                    hostname: libUrl.parse(req).hostname,
                    headers : req.headers
                };

                let request = libHttp.request(option, (response) => {
                    let resBody = new Buffer(0);
                    response.on('data', (data) => {
                        resBody = Buffer.concat([resBody, data]);
                    }).on('end', () => {
                        resolve(response, resBody);
                    }).on('error', (e) => {
                        reject(e);
                    });
                });
                request.end(reqbody);
            }).on('error', (e) => {
                reject(e);
            });
        });
    },
    processResource = (req, res) => {
        toRequest(req).then((response, resBody) => {
            res.writeHead(response.statusCode, response.header);
            res.end(resBody);
        });
    },
    processApi = (req, res) => {
        toRequest(req).then((response, resBody) => {
            res.writeHead(response.statusCode, response.header);
            res.end(resBody);


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
export default new Proxy();

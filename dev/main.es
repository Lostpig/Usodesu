import app           from 'app';
import BrowserWindow from 'browser-window';
import repoter       from 'crash-reporter';
import path          from 'path';

import Proxy from './libs/proxy';
import {load, save, config} from './libs/config';
import {error} from './libs/utils';

const DIRNAME = path.normalize(`${__dirname}/..`);
global.BASEPATH = DIRNAME;
global.DISTPATH = `${DIRNAME}/dist/`;
global.DEFAULTCONFIG = `${DIRNAME}/config.json`;
global.USERCONFIG = `${DIRNAME}/userset.json`;

load().then((cfg) => {
    if(!cfg.cachefolder) {
        config.cachefolder = `${DIRNAME}/cache/`;
    }
    if(!cfg.sshotfolder) {
        config.sshotfolder = `${DIRNAME}/screenshot/`;
    }
    save().then((success) => {
        run();
    });
});

let run = () => {
    new Proxy(config.listenport);
    repoter.start();

    app.commandLine.appendSwitch('proxy-server', `127.0.0.1:${config.listenport}`);
    app.commandLine.appendSwitch('ignore-certificate-errors');

    let mainWindow = global.mainWindow = null;
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('ready', function() {
        mainWindow = new BrowserWindow({
            x                : 0,
            y                : 0,
            width            : 800,
            height           : 600,
            'web-preferences': {
                'web-security': false
            }
        });
        if (process.versions.electron >= '0.27.3') {
            if (process.platform !== 'darwin') {
                mainWindow.setMenu(null);
            }
        }

        mainWindow.loadUrl(`file://${DIRNAME}/index.html`);
        //mainWindow.openDevTools();
        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    });
}

//Uncaught error
process.on('uncaughtException', (e) => {
    error(e);
});

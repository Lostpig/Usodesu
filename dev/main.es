import app           from 'app';
import BrowserWindow from 'browser-window';
import repoter       from 'crash-reporter';
import path          from 'path';
import ipc           from 'ipc';

import Proxy from './libs/proxy';
import {load, save, config} from './libs/config';
import {error} from './libs/utils';

const DIRNAME = path.normalize(`${__dirname}/..`);
global.BASEPATH = DIRNAME;
global.DISTPATH = `${DIRNAME}/dist/`;
global.DEFAULTCONFIG = `${DIRNAME}/config.json`;
global.USERCONFIG = `${DIRNAME}/userset.json`;

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
        let screen = require('screen');
        let screenSize = screen.getPrimaryDisplay().workAreaSize;
        mainWindow = new BrowserWindow({
            'x'              : 0,
            'y'              : 0,
            'width'          : 800,
            'height'         : screenSize.height,
            'title'          : 'Usodesu',
            'frame'          : false,
            'transparent'    : true,
            'web-preferences': {
                'web-security': false
            }
        });
        if (process.versions.electron >= '0.27.3') {
            if (process.platform !== 'darwin') {
                mainWindow.setMenu(null);
            }
        }

        mainWindow.loadUrl(`file://${DIRNAME}/index.html#horizonal`);
        mainWindow.openDevTools({detach: true});
        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    });

    ipc.on( 'app-quit', (event) => {
        event.returnValue = true;
        mainWindow.close();
    });
    ipc.on( 'app-minimize', (event) => {
        event.returnValue = true;
        mainWindow.minimize();
    });
};

//Uncaught error
process.on('uncaughtException', (e) => {
    error(e);
});

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

import app from 'app';
import BrowserWindow from 'browser-window';
import repoter from 'crash-reporter';

import './libs/proxy';
import {error} from './libs/utils';

repoter.start();

app.commandLine.appendSwitch('proxy-server', '127.0.0.1:12450');
app.commandLine.appendSwitch('ignore-certificate-errors');

let mainWindow = global.mainWindow = null;
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    if (process.versions.electron >= '0.27.3') {
        if (process.platform !== 'darwin') {
            mainWindow.setMenu(null);
        }
    }

    mainWindow.loadUrl(`file://${__dirname}/index.html`);
    mainWindow.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

//Uncaught error
process.on('uncaughtException', (e) => {
    error(e);
});

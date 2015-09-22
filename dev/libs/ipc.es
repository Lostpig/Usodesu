import ipc    from 'ipc';
import addons from './addons';
let mainWindow = global.mainWindow;

ipc.on('app-quit', (event) => {
    event.returnValue = true;
    addons.closeAll();
    mainWindow.close();
});
ipc.on('app-minimize', (event) => {
    event.returnValue = true;
    mainWindow.minimize();
});
//ipc.on('addon-loaded', (event, optjson) => {
//    let opt = JSON.parse(optjson);
//    event.returnValue = Addons.getWindow(opt.id, opt.options);
//});

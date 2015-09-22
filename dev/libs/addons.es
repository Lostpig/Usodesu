import BrowserWindow from 'browser-window';
import libFs         from 'fs';
import libPath       from 'path';
import './utils';

let forceClose = false,
    addons = new Map();

export default {
    getWindow: function(id, option) {
        if (addons.has(id)) { return addons.get(id); }
        else {
            option = Object.assign(option, {
                show             : false,
                'web-preferences': {
                    'web-security': false,
                    'plugins'     : true
                }
            });

            let newWin = new BrowserWindow(option);
            if (process.versions.electron >= '0.27.3' && process.platform !== 'darwin') {
                newWin.setMenu(null);
            }
            addons.set(id, newWin);

            let show = newWin.show;
            newWin.show = () => {
                if (newWin.isMinimized()) { newWin.restore(); }
                else { show.bind(newWin)(); }
            };

            newWin.on('closed', (e) => {
                this.addons.delete(id);
            });
            newWin.on('close', (e) => {
                newWin.hide();
                if(!forceClose) {
                    e.preventDefault();
                }
            });

            return newWin;
        }
    },
    closeAll: function() {
        forceClose = true;
        for(let addonWin of addons.values()) {
            addonWin.close();
        }
    }
};

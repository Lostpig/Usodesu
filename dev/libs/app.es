import ipc from 'ipc';
let remote = window.remote;

class App {
    construct() {

    }
    quit() {
        ipc.sendSync('app-quit');
    }
    devTool(mode) {
        if (mode === 1) { remote.getCurrentWindow().openDevTools({ detach: true }); }
        else { window.kanView.openDevTools({ detach: true }); }
    }
};

export default new App();

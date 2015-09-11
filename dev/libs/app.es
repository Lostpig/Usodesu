import ipc from 'ipc';

class App {
    construct() {

    }
    quit() {
        ipc.sendSync('app-quit');
    }
};

window.App = new App();
export default window.App;

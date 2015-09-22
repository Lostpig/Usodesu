import '../../dist/libs/utils';
let remote = require('remote');
let AddonManager = remote.require('./dist/libs/addons');
let handleWin = null;
let config = {
    url  : './index.html',
    title: 'Ship List',
    id   : 'ShipList'
};

let init = () => {
    handleWin = AddonManager.getWindow(config.id, {
        x     : 0,
        y     : 0,
        width : 1020,
        height: 650
    });
    handleWin.loadUrl(`file://${__dirname}/index.html`);
};
init();

let addon = Object.assign(config, {
    run: () => {
        handleWin.show();
    },
    debug: () => {
        handleWin.openDevTools({ detach: true });
    }
});
export default addon;

import {error, readAsync, writeAsync} from './utils';

let config = {};

let load = () => {
    let defconfig, userconfig;
    readAsync(global.DEFAULTCONFIG).then((data) => {
        defconfig = JSON.parse(data);
        return readAsync(global.USERCONFIG);
    }).then((data) => {
        userconfig = JSON.parse(data);
        config = Object.assign(defconfig, userconfig);
    }).catch((e) => {
        error(e);
    });
};

let save = () => {
    let jsondata = JSON.stringify(config);
    writeAsync(global.USERCONFIG, jsondata)
    .then()
    .catch((e) => {
        error(e);
    });
};

export { load, save, config };
export default config;

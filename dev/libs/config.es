import {error, readAsync, writeAsync} from './utils';

let config = {};

let load = async () => {
    try {
        let defconfig, userconfig;
        defconfig = await readAsync(global.DEFAULTCONFIG);
        userconfig = await readAsync(global.USERCONFIG);
        if(defconfig !== null) {
            defconfig = JSON.parse(defconfig);
        }
        else {
            defconfig = {};
        }
        if(userconfig !== null) {
            userconfig = JSON.parse(userconfig);
        }
        else {
            userconfig = {};
        }

        config = Object.assign(defconfig, userconfig);

        return config;
    }
    catch(e) {
        error(e);
        return null;
    }
};

let save = async () => {
    try{
        let jsondata = JSON.stringify(config);
        let success = await writeAsync(global.USERCONFIG, jsondata);
        return success;
    }
    catch(e) {
        error(e);
        return false;
    }
};

export { load, save, config };
export default config;

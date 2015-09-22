import libFs   from 'fs';
import libPath from 'path';

let Addonlist = [],
    scanAddons = () => {
        let path = libPath.join(window.BASEPATH, 'addons');
        let files = libFs.readdirSync(path);
        for (let i = 0, l = files.length; i < l; i++) {
            let stat = libFs.statSync(path + '/' + files[i]);
            if (stat.isDirectory()) {
                let addPath = libPath.join(path, files[i]);
                if(libFs.existsSync(addPath)) {
                    Addonlist.push(require(addPath));
                }
            }
        }
    };
scanAddons();

let OpenAddon = (addon) => {
        addon.run();
    },
    Debugger = (addon) => {
        if(addon.debug) {
            addon.debug();
        }
    };

let addonsCtrl = angular.module('usodesu.addons', [])
.controller('addonsCtrl', ['$scope', ($scope) => {
    $scope.addons = Addonlist;
    $scope.OpenAddon = OpenAddon;
    $scope.Debug = Debugger;
}]);

export default addonsCtrl;

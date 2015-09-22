let models   = window.models,
    observer = window.observer;

let resource = models.get('Resource'),
    basic    = models.get('BasicInfo'),
    ships    = models.get('Ships'),
    equips   = models.get('Equips');

let toolbar = angular.module('usodesu.toolbar', [])
.controller('toolbarCtrl', ['$scope', ($scope) => {
    let self = this;
    $scope.menushow = false;
    $scope.shipcount  = 0;
    $scope.equipcount = 0;

    observer
    .watch(resource, function updateResource (md) {
        $scope.fuel     = md.get('fuel');
        $scope.bullet   = md.get('bullet');
        $scope.steel    = md.get('steel');
        $scope.bauxite  = md.get('bauxite');
        $scope.construct= md.get('construct');
        $scope.repair   = md.get('repair');
        $scope.material = md.get('material');
        $scope.remodel  = md.get('remodel');

        $scope.$apply();
    })
    .watch(basic, function updateBasicinfo (md) {
        $scope.player   = md.get('name');
        $scope.level    = md.get('level');
        $scope.rank     = md.get('rank');
        $scope.exp      = md.get('exp');
        $scope.shipslot = md.get('shipslots');
        $scope.equipslot= md.get('equipslots');

        $scope.$apply();
    })
    .watch(ships, function updateShipcount (md) {
        $scope.shipcount = md.size;
        $scope.$apply();
    })
    .watch(equips, function updateEquipcount (md) {
        $scope.equipcount = md.size;
        $scope.$apply();
    });
}]);

export default toolbar;

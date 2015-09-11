let models   = window.models,
    observer = window.observer;

let resource = models.getrecord('resource'),
    basic    = models.getrecord('basicinfo'),
    ships    = models.getrecord('ships'),
    equips   = models.getrecord('equips');

let toolbar = angular.module('usodesu.toolbar', [])
.controller('toolbarCtrl', ['$scope', ($scope) => {
    let self = this;
    $scope.shipcount  = 0;
    $scope.equipcount = 0;

    observer
    .watch(resource, (md) => {
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
    .watch(basic, (md) => {
        $scope.player   = md.get('name');
        $scope.level    = md.get('level');
        $scope.rank     = md.get('rank');
        $scope.exp      = md.get('exp');
        $scope.shipslot = md.get('shipslots');
        $scope.equipslot= md.get('equipslots');

        $scope.$apply();
    })
    .watch(ships, (md) => {
        $scope.shipcount = md.size;
        $scope.$apply();
    })
    .watch(equips, (md) => {
        $scope.equipcount = md.size;
        $scope.$apply();
    });
}]);

export default toolbar;

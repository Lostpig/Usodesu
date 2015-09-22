let models   = window.models,
    observer = window.observer;

let BasicInfo  = models.get('BasicInfo'),
    Ships      = models.get('Ships'),
    Resource   = models.get('Resource'),
    Decks      = models.get('ShipDeck'),
    RepairDock = models.get('RepairDock'),
    Quest      = models.get('Quest');

let commonModule = angular.module('usodesu.common', [])
.controller('resourceCtrl', ['$scope', ($scope) => {
    $scope.fuel = 0;
    $scope.bullet = 0;
    $scope.steel = 0;
    $scope.bauxite = 0;
    $scope.construct = 0;
    $scope.repair = 0;
    $scope.material = 0;
    $scope.remodel = 0;

    observer.watch(Resource, (md) => {
        $scope.fuel      = md.get('fuel');
        $scope.bullet    = md.get('bullet');
        $scope.steel     = md.get('steel');
        $scope.bauxite   = md.get('bauxite');
        $scope.construct = md.get('construct');
        $scope.repair    = md.get('repair');
        $scope.material  = md.get('material');
        $scope.remodel   = md.get('remodel');

        $scope.$apply();
    });
}])
.controller('missionCtrl', ['$scope', ($scope) => {
    $scope.missions = [];
    observer.watch(Decks, (md) => {
        for (let i = 2, l = Decks.size; i <= l; i++) {
            let deck = Decks.get(i);
            $scope.missions[i - 2] = deck.mission;
        }
        $scope.$apply();
    });
}])
.controller('repairdockCtrl', ['$scope', ($scope) => {
    $scope.repairDocks = [];
    observer.watch(RepairDock, (md) => {
        for (let i = 1, l = RepairDock.size; i <= l; i++) {
            let dock = RepairDock.get(i);
            $scope.repairDocks[i - 1] = dock;
        }
        $scope.$apply();
    });
}])
.controller('questCtrl', ['$scope', ($scope) => {
    $scope.quests = [];
    observer.watch(Quest, (md) => {
        $scope.quests = md.filter((item) => { return item.state >= 2; });
        $scope.$apply();
    });
}]);

export default commonModule;

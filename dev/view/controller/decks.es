let models   = window.models,
    observer = window.observer;

let
    Ships = models.getrecord('ships'),
    Decks = models.getrecord('shipdeck');

let
    sum = (arr) => {
        let s = 0, i = 0;
        while(i < arr.length) { s += arr[i]; i++; }
        return s;
    },
    avg = (arr) => {
        let l = arr.length, s = sum(arr);
        return s/l;
    };

let deckModule = angular.module('usodesu.decks', [])
.controller('deckCtrl', ['$scope', ($scope) => {
    $scope.$on('deckChange', (event, deckid) => {
        $scope.$broadcast('deckChangeFromParent', deckid);
    });
}])
.controller('deckstabCtrl', ['$scope', ($scope) => {
    $scope.decks = [];
    $scope.change = (deckid) => {
        $scope.$emit('deckChange', deckid);
    };

    observer.watch(Decks, (md) => {
        for(let deck of md.map.values()) {
            $scope.decks[deck.id] = deck;
        }
        $scope.$apply();
    });
}])
.controller('deckinfoCtrl', ['$scope', ($scope) => {
    $scope.deckid = 1;
    $scope.avglv = 0;
    $scope.sumlv = 0;
    $scope.aa = 0;
    $scope.range = 0;
    $scope.ships = [];
    let render = (md) => {
        let ships = md.get($scope.deckid).ship;
        let levels = ships.map((item) => { return item.level; });
        $scope.avglv = avg(levels);
        $scope.sumlv = sum(levels);
        $scope.ships = ships;
    };

    $scope.$on('deckChangeFromParent', (event, deckid) => {
        $scope.deckid = deckid;
        render(Decks);
    });

    observer
    .watch(Decks, (md) => {
        render(md);
        $scope.$apply();
    })
    .watch(Ships, (md) => {
        $scope.$apply();
    });
}]);

export default deckModule;

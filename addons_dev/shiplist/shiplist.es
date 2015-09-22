import Models   from '../../dist/models/models';
import Observer from '../../dist/view/apiObserver';

let Ships = Models.get('Ships');
window.testShips = Ships;

angular.module('usodesu.shiplist', [])
.controller('shipsCtrl', ['$scope', ($scope) => {
    $scope.ships = [];
    console.log('go to in controller');
    Observer.watch(Ships, (md) => {
        $scope.ships = md.filter(() => { return true; });
        $scope.$apply();
    });
}]);

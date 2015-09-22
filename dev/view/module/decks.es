let models   = window.models,
    observer = window.observer;

let
    Ships = models.get('Ships'),
    Decks = models.get('ShipDeck'),
    BasicInfo = models.get('BasicInfo');

let
    sum = (arr) => {
        let s = 0, i = 0;
        while(i < arr.length) { s += arr[i]; i++; }
        return s;
    },
    avg = (arr) => {
        let l = arr.length, s = sum(arr);
        return s/l;
    },
    sumAD = (ships) => {
        let adBasic = 0,
            adSkill = 0;
        for (let ship of ships) {
            if (ship === null) { continue; }
            for (let [index, equip] of ship.equips.entries()) {
                if (equip === null || !equip.base.isplane) { continue; }
                adBasic += Math.floor(Math.sqrt(ship.planes[index]) * equip.base.airdomin);

                if(equip.planelv > 0 && equip.planelv <= 7) {
                    switch(equip.base.type[3]) {
                        case 6:
                            adSkill += [0, 1, 4, 6, 11, 16, 17, 25][equip.planelv]; break;
                        case 7:
                        case 8:
                            adSkill += [0, 1, 1, 1, 2, 2, 2, 3][equip.planelv]; break;
                        case 10:
                            adSkill += equip.base.type[2] === 11 ? [0, 1, 2, 2, 4, 4, 4, 9][equip.planelv] : 0; break;
                    }
                }
            }
        }
        return { basic: adBasic, skill: adSkill, total: adBasic + adSkill };
    },
    sumRange = (ships) => {
        let total = 0;
        for (let ship of ships) {
            if (ship === null) { continue; }
            let shipBase = ship.scanrange.base;
            for (let equip of ship.equips) {
                if (equip === null) { continue; }
                shipBase = shipBase - equip.base.scanrange;
                switch(equip.base.type[3]) {
                    case 7: total += equip.base.scanrange * 1.04; break;
                    case 8: total += equip.base.scanrange * 1.37; break;
                    case 9: total += equip.base.scanrange * 1.66; break;
                    case 10:
                        if (equip.base.type[3] === 10) { total += equip.base.scanrange * 2.00; }
                        else if (equip.base.type[3] === 11) { total += equip.base.scanrange * 1.78; }
                        break;
                    case 11:
                        if (equip.base.type[3] === 12) { total += equip.base.scanrange * 1.00; }
                        else if (equip.base.type[3] === 13) { total += equip.base.scanrange * 0.99; }
                        break;
                    case 24: total += equip.base.scanrange * 0.91; break;
                }
            }
            total += Math.sqrt(shipBase) * 1.69;
        }
        let tlv = BasicInfo.get('level'),
            tdiff = 0.61 * Math.floor((tlv + 4) / 5) * 5;
        total = total - tdiff;
        return total;
    };

let selectedDeck = 1;
let deckModule = angular.module('usodesu.decks', [])
.controller('deckCtrl', ['$scope', ($scope) => {
    $scope.$on('deckTabClick', (event, deckid) => {
        selectedDeck = deckid;
        $scope.$broadcast('deckChange');
    });

    observer
    .watch(Decks, function updateDecks (md) {
        $scope.$broadcast('decksUpdate', md);
        $scope.$apply();
    })
    .watch(Ships, function updateShips (md) {
        $scope.$broadcast('shipsUpdate', md);
        $scope.$apply();
    });
}])
.controller('deckstabCtrl', ['$scope', ($scope) => {
    $scope.decks = [];
    $scope.selectedId = selectedDeck;
    $scope.change = (deckid) => {
        if(selectedDeck !== deckid) {
            $scope.$emit('deckTabClick', deckid);
        }
    };

    $scope.$on('deckChange', (event) => {
        $scope.selectedId = selectedDeck;
    });
    $scope.$on('decksUpdate', (event, md) => {
        for(let deck of md.map.values()) {
            $scope.decks[deck.id - 1] = deck;
        }
    });
}])
.controller('deckinfoCtrl', ['$scope', ($scope) => {
    $scope.avglv = 0;
    $scope.sumlv = 0;
    $scope.aa = 0;
    $scope.range = 0;
    $scope.ships = [];

    let render = (md) => {
        let ships = md.get(selectedDeck).ship;
        let levels = ships.map((item) => { return item.level; });
        $scope.avglv = avg(levels);
        $scope.sumlv = sum(levels);
        $scope.airdomin = sumAD(ships);
        $scope.scanrange = sumRange(ships);
        $scope.ships = ships;
    };

    $scope.$on('deckChange', (event) => {
        render(Decks);
    });
    $scope.$on('decksUpdate', (event, md) => {
        render(md);
    });
}]);

export default deckModule;

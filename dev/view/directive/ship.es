let usodesu = window.usodesu;

let
    barStyle = (perc) => {
        let states = [
            {threshold: 70, style: 'normal'},
            {threshold: 40, style: 'warn'},
            {threshold: 0,  style: 'danger'}
        ];
        let result = '';
        for(let i in states) {
            if(perc >= states[i].threshold) {
                result = states[i].style;
                break;
            }
        }
        return result;
    },
    circleLen = (perc, angle) => {
        let dmg = (100 - perc) / 100,
            deg = Math.ceil(angle * dmg);
        return deg;
    },
    shipLinker = (scope, element, attrs) => {
        scope.shipclass = attrs.shipClass;
        let ship = scope[attrs.shipData];
        scope.name = ship.shipinfo.name;
        scope.level = ship.level;
        scope.needexp = ship.needexp;
        scope.cond = ship.cond;
        scope.hp = ship.hp;
        scope.hpmax = ship.hpmax;
        scope.equips = ship.equips;

        scope.hpperc = Math.ceil(ship.hp / ship.maxhp * 100);
        scope.bulletperc = Math.ceil(ship.bullet / ship.shipinfo.bulletmax * 100);
        scope.fuelperc = Math.ceil(ship.fuel / ship.shipinfo.fuelmax * 100);

        scope.barstyle = barStyle;
        scope.circlelen = circleLen;
    };

usodesu
.directive('ucShip', () => {
    return {
        restrict   : 'E',
        templateUrl: 'static/views/directive/ship.html',
        replace    : true,
        link       : shipLinker
    };
})
.directive('ucShipcircle', () => {
    return {
        restrict   : 'E',
        templateUrl: 'static/views/directive/ship-circle.html',
        replace    : true,
        link       : shipLinker
    };
});

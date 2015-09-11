import BaseModel from '../base';
import Shipinfo  from '../data/shipinfo';
import Equips    from './equips';

let getEquips = (apislot) => {
    let eq = [];
    for(let i in apislot) {
        if(apislot[i] > 0){
            eq.push(Equips.get(apislot[i]));
        }
    }
    return eq;
};

class Ships extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Ships';
        this.addDependency(Shipinfo);
    }
    parse(ship_item) {
        let shipinfo = Shipinfo.get(ship_item.api_ship_id);
        let ship = {
            id      : ship_item.api_id,
            sortno  : ship_item.api_sortno,
            shipinfo: shipinfo,
            level   : ship_item.api_lv,
            needexp : ship_item.api_exp[1],
            expperc : ship_item.api_exp[2],
            hp      : ship_item.api_nowhp,
            hpmax   : ship_item.api_maxhp,
            cond    : ship_item.api_cond,
            locked  : ship_item.api_locked === 1,

            equips : getEquips(ship_item.api_slot),
            planes : ship_item.api_onslot,
            slotnum: ship_item.api_slotnum,
            fuel   : ship_item.api_fuel,
            bullet : ship_item.api_bull,

            firepower: {
                base: shipinfo.firepower.base + ship_item.api_kyouka[0],
                max : ship_item.api_karyoku[1],
                now : ship_item.api_karyoku[0]
            },
            torpedo: {
                base: shipinfo.torpedo.base + ship_item.api_kyouka[1],
                max : ship_item.api_raisou[1],
                now : ship_item.api_raisou[0]
            },
            antiair: {
                base: shipinfo.antiair.base + ship_item.api_kyouka[2],
                max : ship_item.api_taiku[1],
                now : ship_item.api_taiku[0]
            },
            armor: {
                base: shipinfo.armor.base + ship_item.api_kyouka[3],
                max : ship_item.api_soukou[1],
                now : ship_item.api_soukou[0]
            },
            lucky: {
                base: shipinfo.lucky.base + ship_item.api_kyouka[4],
                max : ship_item.api_lucky[1],
                now : ship_item.api_lucky[0]
            },
            dodge: {
                base: ship_item.api_kaihi[0],
                max : ship_item.api_kaihi[1]
            },
            antisub: {
                base: ship_item.api_taisen[0],
                max : ship_item.api_taisen[1]
            },
            scanrange: {
                base: ship_item.api_sakuteki[0],
                max : ship_item.api_sakuteki[1]
            },
        };

        return ship;
    }
}

export default new Ships();

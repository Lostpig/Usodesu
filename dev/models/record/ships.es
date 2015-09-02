import BaseModel from '../base';
import Shipinfo  from '../data/shipinfo';

class Ships extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Ships';
        this.addDependency(Shipinfo);
    }
    parse(ship_item) {
        let ship = {
            id      : api_id,
            sortno  : api_sortno,
            shipinfo: Shipinfo.get(api_ship_id),
            level   : api_lv,
            needexp : api_exp[1],
            expperc : api_exp[2],
            hp      : api_nowhp,
            hpmax   : api_maxhp,
            equip   : api_onslot,
            
        }
        return ship;
    }
}

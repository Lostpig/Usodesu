import BaseModel from '../base';
import Shiptype  from './shiptype';

class Shipinfo extends BaseModel {
    constructor() {
        super();
        this.addDependency(Shiptype);
        this.modelname = 'ShipInfo';
    }
    parse(ship_item) {
        if(ship_item.api_id > 500) { return false; }
        let shipinfo = {
            id       : ship_item.api_id,
            sortno   : ship_item.api_sortno,
            name     : ship_item.api_name,
            type     : Shiptype.get(ship_item.api_stype),
            afterlv  : ship_item.api_afterlv,
            hp       : ship_item.api_taik[0],
            firepower: ship_item.api_houg[1],
            torpedo  : ship_item.api_raig[1],
            antiair  : ship_item.api_raig[1],
            armor    : ship_item.api_souk[1],
            lucky    : ship_item.api_luck[1],
            slotcount: ship_item.api_slot_num,
            feulmax  : ship_item.api_fuel_max,
            bulletmax: ship_item.api_bull_max
        };
        return shipinfo;
    }
}

export default new Shipinfo();

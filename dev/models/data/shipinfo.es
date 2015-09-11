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
            hp       : { base: ship_item.api_taik[0], max: ship_item.api_taik[1] },
            firepower: { base: ship_item.api_houg[0], max: ship_item.api_houg[1] },
            torpedo  : { base: ship_item.api_raig[0], max: ship_item.api_raig[1] },
            antiair  : { base: ship_item.api_tyku[0], max: ship_item.api_tyku[1] },
            armor    : { base: ship_item.api_souk[0], max: ship_item.api_souk[1] },
            lucky    : { base: ship_item.api_luck[0], max: ship_item.api_luck[1] },
            slotcount: ship_item.api_slot_num,
            fuelmax  : ship_item.api_fuel_max,
            bulletmax: ship_item.api_bull_max
        };
        return shipinfo;
    }
}

export default new Shipinfo();

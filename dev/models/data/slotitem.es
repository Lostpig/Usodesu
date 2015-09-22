import BaseModel from '../base';
import Gene      from '../general';

class Slotitem extends BaseModel {
    constructor() {
        super();
        this.modelname = 'SlotItem';
    }
    parse(slot_item) {
        let slotitem = {
            id       : slot_item.api_id,
            sortno   : slot_item.api_sortno,
            name     : slot_item.api_name,
            type     : slot_item.api_type,
            isplane  : Gene.isPlane(slot_item.api_type[3]),
            firepower: slot_item.api_houg,
            armor    : slot_item.api_souk,
            torpedo  : slot_item.api_raig,
            antiair  : slot_item.api_tyku,
            airdomin : Gene.getAirDominance(slot_item.api_type, slot_item.api_tyku),
            bomb     : slot_item.api_baku,
            antisub  : slot_item.api_tais,
            hit      : slot_item.api_houm,
            dodge    : slot_item.api_houk,
            scanrange: slot_item.api_saku
        };
        return slotitem;
    }
}

export default new Slotitem();

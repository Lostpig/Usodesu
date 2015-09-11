import BaseModel from '../base';
import Slotitem  from '../data/slotitem';

class Equips extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Equips';
        this.addDependency(Slotitem);
    }
    parse (equip_item) {
        return {
            id     : equip_item.api_id,
            locked : equip_item.api_locked === 1,
            remodel: equip_item.api_level,
            planelv: equip_item.api_alv,
            base   : Slotitem.get(equip_item.api_slotitem_id),
        };
    }
}

export default new Equips();

import BaseModel from '../base';

class Shiptype extends BaseModel {
    constructor() {
        super();
        this.modelname = 'ShipType';
    }
    parse(stype_item) {
        let stype = {
            id    : stype_item.api_id,
            sortno: stype_item.api_sortno,
            name  : stype_item.api_name
        };
        return stype;
    }
}

export default new Shiptype();

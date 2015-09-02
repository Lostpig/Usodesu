import BaseModel from '../base';

class Shipinfo extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Equiptype';
    }
    parse(etype_item) {
        let equiptype = {
            id  : etype_item.api_id,
            name: etype_item.api_name,
            flg : etype_item.api_show_flg   //what's this?
        };
        return equiptype;
    }
}

export default new Shipinfo();

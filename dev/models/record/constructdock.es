import BaseModel from '../base';
import Shipinfo  from '../data/shipinfo';

class ConstructDock extends BaseModel {
    constructor() {
        super();
        this.modelname = 'ConstructDock';
    }
    parse(api_data) {
        let dock = {
            id      : api_data.api_id,
            state   : api_data.api_state,
            shipid  : api_data.api_ship_id,
            shipname: Shipinfo.get(api_data.api_ship_id).name,
            complete: api_data.api_complete_time
        };
        return dock;
    }
}

export default new ConstructDock();

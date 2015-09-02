import BaseModel from '../base';
import Maparea   from './maparea';

class Mission extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Mission';
    }
    parse(ms_item) {
        let mission = {
            id     : ms_item.api_id,
            area   : Maparea.get(ms_item.api_maparea_id),
            name   : ms_item.api_name,
            details: ms_item.api_details,
            time   : ms_item.api_time
        };
        return mission;
    }
}

export default new Mission();

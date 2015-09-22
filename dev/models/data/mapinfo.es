import BaseModel from '../base';
import Maparea   from './maparea';
import Gene      from '../general';

class Mapinfo extends BaseModel {
    constructor() {
        super();
        this.modelname = 'MapInfo';
        this.addDependency(Maparea);
    }
    parse(map_item) {
        let mapinfo = {
            id   : map_item.api_id,
            area : Maparea.get(map_item.api_maparea_id),
            no   : map_item.api_no,
            sign : `${map_item.api_maparea_id}-${map_item.api_no}`,
            name : map_item.api_name,
            level: map_item.api_level,
            text : map_item.api_opetext,
            union: Gene.isUnion(map_item.api_sally_flag)
        };
        return mapinfo;
    }
}

export default new Mapinfo();

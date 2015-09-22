import BaseModel from '../base';
import Gene      from '../general';

class Maparea extends BaseModel {
    constructor() {
        super();
        this.modelname = 'MapArea';
    }
    parse(area_item) {
        let area = {
            id  : area_item.api_id,
            name: area_item.api_name,
            type: Gene.getAreaType(area_item.api_type)
        };
        return area;
    }
}

export default new Maparea();

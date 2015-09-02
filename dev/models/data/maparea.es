import BaseModel from '../base';

class Maparea extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Maparea';
    }
    parse(area_item) {
        let area = {
            id  : area_item.api_id,
            name: area_item.api_name,
            type: area_item.api_type
        };
        return area;
    }
}

export default new Maparea();

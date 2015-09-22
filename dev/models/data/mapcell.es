import BaseModel from '../base';
import Mapinfo   from './mapinfo';

class Mapcell extends BaseModel {
    constructor() {
        super();
        this.modelname = 'MapCell';
        this.addDependency(Mapinfo);
    }
    parse(cell_item) {
        let mapcell = {
            id : cell_item.api_id,
            no : cell_item.api_no,
            map: Mapinfo.get(cell_item.api_map_no)
        };
        return mapcell;
    }
}

export default new Mapcell();

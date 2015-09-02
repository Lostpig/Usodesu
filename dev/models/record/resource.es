import BaseModel from '../base';

let keys = ['fuel', 'bullet','steel','bauxite',
        'build','repair','material','remodel'];

class Resource extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Resource';
    }
    parse (index) {
        return keys[index];
    }
    set (item, index) {
        let key = this.parse(index);
        this.map.set(key, item);
    }
}

export default new Resource();

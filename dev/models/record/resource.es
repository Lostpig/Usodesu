import BaseModel from '../base';

let keys = ['fuel', 'bullet','steel','bauxite',
        'construct','repair','material','remodel'];

class Resource extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Resource';
    }
    parse (item, index) {
        let r;
        if (typeof index === 'string') {
            index = parseInt(index.slice(1,2));
        }
        if (typeof item === 'number') {
            r = {
                key  : keys[index],
                value: item
            };
        }
        else {
            r = {
                key  : keys[item.api_id - 1],
                value: item.api_value
            };
        }

        return r;
    }
    set (item, index) {
        let res = this.parse(item, index);
        this.map.set(res.key, res.value);
    }
}

export default new Resource();

import Gene from '../general';
import BaseModel from '../base';

let attrs = {
    'api_member_id'   : { key: 'id' },
    'api_level'       : { key: 'level' },
    'api_nickname'    : { key: 'name' },
    'api_comment'     : { key: 'comment' },
    'api_rank'        : { key: 'rank', process: function(val) { return Gene.getRank(val); } },
    'api_experience'  : { key: 'exp' },
    'api_max_chara'   : { key: 'shipslots' },
    'api_max_slotitem': { key: 'equipslots' },
    'api_count_deck'  : { key: 'deck' },
    'api_count_kdock' : { key: 'constructdock' },
    'api_count_ndock' : { key: 'repairdock' }
};

class Basicinfo extends BaseModel {
    constructor() {
        super();
        this.modelname = 'BasicInfo';
    }
    parse(item, key) {
        let attr = attrs[key],
            result = false;
        if(attr) {
            if(attr.parse && typeof attr.parse === 'function') {
                result = { key: attr.key, value: attr.process(item) };
            }
            else {
                result = { key: attr.key, value: item };
            }
        }
        return result;
    }
    set(item, index) {
        try {
            let parseItem = this.parse(item, index);
            if (parseItem !== false) {
                this.map.set(parseItem.key, parseItem.value);
            }
        }
        catch(e) {
            error(`[${this.modelname} ERROR]:${e}`);
        }
    }
}

export default new Basicinfo();

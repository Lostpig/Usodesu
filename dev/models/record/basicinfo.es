import Gene from '../general';
import BaseModel from '../base';

let attrs = {
    'id'        : { key: 'api_member_id' },
    'level'     : { key: 'api_level' },
    'name'      : { key: 'api_nickname' },
    'comment'   : { key: 'api_comment' },
    'rank'      : { key: 'api_rank', parse: function(val) { return Gene.getRank(val); } },
    'exp'       : { key: 'api_experience' },
    'shipslots' : { key: 'api_max_chara' },
    'equipslots': { key: 'api_max_slotitem' },
    'deck'      : { key: 'api_count_deck' },
    'builddock' : { key: 'api_count_kdock' },
    'repairdock': { key: 'api_count_ndock' }
}

class Basicinfo extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Basicinfo';
    }
    parse(item) {
        let attr = attrs[item.key],
            result = false;
        if(attr) {
            if(attr.parse && typeof attr.parse === 'function') {
                result = attr.parse(item.value);
            }
            else {
                result = item.value;
            }
        }
        return result;
    }
}

export default new Basicinfo();

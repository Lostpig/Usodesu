import Gene from '../general';
import BaseModel from '../base';

class Quest extends BaseModel {
    constructor() {
        super();
        this.modelname = 'Quest';
    }
    update(questlist) {
        for(let [index, item] of questlist.list.entries()) {
            this.set(item, index);
        }
    }
    parse(qu) {
        let questinfo = {
            id      : qu.api_no,
            category: qu.api_category,
            type    : qu.api_type,
            state   : qu.api_state,
            title   : qu.api_title,
            detail  : qu.api_detail,
            progress: qu.api_progress_flag
        }
        return questinfo;
    }
}

export default new Quest();

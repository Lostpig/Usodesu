import models from '../models/models';
import remote from 'remote';
let api = remote.require('./dist/libs/api');

let
    watchList = {},
    doWatch = (md) => {
        if(watchList[md.modelname] && watchList[md.modelname].list.length > 0) {
            for (let method of watchList[md.modelname].list) {
                method(md);
            }
        }
    },
    watcher = (md) => {
        return Object.create({}, {
            update: {
                configurable: false,
                value       : (data) => {
                    md.update(data);
                    doWatch(md);
                }
            },
            trigger: {
                configurable: false,
                value       : () => {
                    doWatch(md);
                }
            },
            model: {
                configurable: false,
                value       : md
            }
        });
    },
    updater = (modelname, update) => {
        if(watchList[modelname]) { update(watchList[modelname].watcher); }
    };
/*let
    BasicInfo     = watcher(models.get('BasicInfo')),
    Resource      = watcher(models.get('Resource')),
    Quest         = watcher(models.get('Quest')),
    ConstructDock = watcher(models.get('ConstructDock')),
    RepairDock    = watcher(models.get('RepairDock')),
    Ships         = watcher(models.get('Ships')),
    ShipDeck      = watcher(models.get('ShipDeck')),
    Equips        = watcher(models.get('Equips'));
*/

let isStart = false;
let triggerProcesser = {
    '/kcsapi/api_start2': (req, res) => {
        let apidata = res.api_data,
            pairsMap = [
                {modelname: 'ShipType' , key: 'api_mst_stype'},
                {modelname: 'ShipInfo' , key: 'api_mst_ship'},

                {modelname: 'EquipType', key: 'api_mst_slotitem_equiptype'},
                {modelname: 'SlotItem' , key: 'api_mst_slotitem'},

                {modelname: 'MapArea'  , key: 'api_mst_maparea'},
                {modelname: 'MapInfo'  , key: 'api_mst_mapinfo'},
                {modelname: 'MapCell'  , key: 'api_mst_mapcell'},

                {modelname: 'Mission'  , key: 'api_mst_mission'}
            ];

        for(let pair of pairsMap) {
            watcher(models.get(pair.modelname)).update(apidata[pair.key]);
        }

        isStart = true;
    },

    '/kcsapi/api_get_member/basic': (req, res) => {
        let apidata = res.api_data;
        updater('BasicInfo', (md) => { md.update(apidata); });
    },
    '/kcsapi/api_get_member/kdock': (req, res) => {
        let apidata = res.api_data;
        updater('ConstructDock', (md) => { md.update(apidata); });
    },
    '/kcsapi/api_get_member/material': (req, res) => {
        let apidata = res.api_data;
        updater('Resource', (md) => { md.update(apidata); });
    },
    '/kcsapi/api_get_member/ndock': (req, res) => {
        let apidata = res.api_data;
        updater('RepairDock', (md) => { md.update(apidata); });
    },
    '/kcsapi/api_get_member/questlist': (req, res) => {
        let apidata = res.api_data;
        updater('Quest', (md) => { md.update(apidata); });
    },
    '/kcsapi/api_get_member/ship3': (req, res) => {
        let apidata = res.api_data;
        updater('Ships', (md) => { md.update(apidata.api_ship_data); });
        updater('ShipDeck', (md) => { md.update(apidata.api_deck_data); });
    },
    '/kcsapi/api_get_member/ship_deck': (req, res) => {
        let apidata = res.api_data;
        updater('Ships', (md) => { md.update(apidata.api_ship_data); });
        updater('ShipDeck', (md) => { md.update(apidata.api_deck_data); });
    },
    '/kcsapi/api_get_member/slot_item': (req, res) => {
        let apidata = res.api_data;
        updater('Equips', (md) => { md.update(apidata); });
    },
    '/kcsapi/api_get_member/unsetslot': (req, res) => {  },

    '/kcsapi/api_port/port': (req, res) => {
        let apidata = res.api_data;
        updater('BasicInfo', (md) => { md.update(apidata.api_basic); });
        updater('Resource', (md) => { md.update(apidata.api_material); });

        updater('Ships', (md) => { md.update(apidata.api_ship); });

        updater('ShipDeck', (md) => { md.update(apidata.api_deck_port); });
        updater('RepairDock', (md) => { md.update(apidata.api_ndock); });
    },

    '/kcsapi/api_req_mission/start': (req, res) => {
        let deckid = req.api_deck_id,
            missionid = postBody.api_mission_id,
            time = res.api_complatetime;

        updater('ShipDeck', (md) => {
            md.model.setMission(deckid, missionid, time);
            md.trigger();
        });
    },
    '/kcsapi/api_req_mission/return_instruction': (req, res) => {
        let deckid = req.api_deck_id,
            time = res.api_mission[2];

        updater('ShipDeck', (md) => {
            md.model.setMission(deckid, null, time);
            md.trigger();
        });
    }
};

class Observer {
    constructor() {
        this.queue = [];
        this.execting = false;
    }
    push(trigger) {
        this.queue.push(trigger);
        this.exec();
    }
    pop() {
        return this.queue.shift();
    }
    exec() {
        if(this.execting) { return; }
        this.execting = true;
        while(this.queue.length > 0) {
            let trigger = this.pop();
            if(!isStart && trigger.path !== '/kcsapi/api_start2') {
                error('kancolle not start(not get start2)'); continue;
            }
            if(triggerProcesser[trigger.path] && typeof triggerProcesser[trigger.path] === 'function') {
                let req       = trigger.request.length > 0 ? JSON.parse(trigger.request) : {},  //JSON.parse(trigger.request),
                    res       = JSON.parse(trigger.response),
                    processer = triggerProcesser[trigger.path];
                processer(req, res);
            }
        }
        this.execting = false;
    }
    watch(md, method) {
        if(!watchList[md.modelname]) {
            watchList[md.modelname] = { watcher: watcher(md), list: [] };
        }
        if(watchList[md.modelname].list.indexOf(method) < 0) {
            watchList[md.modelname].list.push(method);
        }

        return this;
    }
    unwatch(md, method) {
        if(watchList[md.modelname]) {
            let index = watchList[md.modelname].list.indexOf(method);
            if(index >= 0) {
                watchList[md.modelname].list.splice(index, 1);
            }
        }

        return this;
    }
}

let apiObserver = new Observer();
api.addListener('response', (path, reqstring, resstring) => {
    apiObserver.push({ path: path, request: reqstring, response: resstring });
});

export default apiObserver;

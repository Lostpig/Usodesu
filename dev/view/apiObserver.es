import models from '../models/models';
let api = window.remote.require('./dist/libs/api');

let
    watchList = {},
    doWatch = (md) => {
        if(watchList[md.modelname] && watchList[md.modelname].length > 0) {
            for (let method of watchList[md.modelname]) {
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
            model: {
                configurable: false,
                value       : md
            }
        });
    };

let
    BasicInfo     = watcher(models.getrecord('basicinfo')),
    Resource      = watcher(models.getrecord('resource')),
    Quest         = watcher(models.getrecord('quest')),
    ConstructDock = watcher(models.getrecord('constructdock')),
    RepairDock    = watcher(models.getrecord('repairdock')),
    Ships         = watcher(models.getrecord('ships')),
    ShipDeck      = watcher(models.getrecord('shipdeck')),
    Equips        = watcher(models.getrecord('equips'));

let isStart = false;
let triggerProcesser = {
    '/kcsapi/api_start2': (req, res) => {
        let apidata = res.api_data,
            pairsMap = [
                {modelname: 'shiptype' , key: 'api_mst_stype'},
                {modelname: 'shipinfo' , key: 'api_mst_ship'},

                {modelname: 'equiptype', key: 'api_mst_slotitem_equiptype'},
                {modelname: 'slotitem' , key: 'api_mst_slotitem'},

                {modelname: 'maparea'  , key: 'api_mst_maparea'},
                {modelname: 'mapinfo'  , key: 'api_mst_mapinfo'},
                {modelname: 'mapcell'  , key: 'api_mst_mapcell'},

                {modelname: 'mission'  , key: 'api_mst_mission'}
            ];

        for(let pair of pairsMap) {
            watcher(models.getdata(pair.modelname)).update(apidata[pair.key]);
        }

        isStart = true;
    },
    '/kcsapi/api_get_member/basic': (req, res) => {
        let apidata = res.api_data;
        BasicInfo.update(apidata);
    },
    '/kcsapi/api_get_member/kdock': (req, res) => {
        let apidata = res.api_data;
        ConstructDock.update(apidata);
    },
    '/kcsapi/api_get_member/material': (req, res) => {
        let apidata = res.api_data;
        Resource.update(apidata);
    },
    '/kcsapi/api_get_member/ndock': (req, res) => {
        let apidata = res.api_data;
        RepairDock.update(apidata);
    },
    '/kcsapi/api_get_member/questlist': (req, res) => {

    },
    '/kcsapi/api_get_member/ship3': (req, res) => {
        let apidata = res.api_data;
        Ships.update(apidata.api_ship_data);
        ShipDeck.update(apidata.api_deck_data);
    },
    '/kcsapi/api_get_member/ship_deck': (req, res) => {
        let apidata = res.api_data;
        Ships.update(apidata.api_ship_data);
        ShipDeck.update(apidata.api_deck_data);
    },
    '/kcsapi/api_get_member/slot_item': (req, res) => {
        let apidata = res.api_data;
        Equips.update(apidata);
    },
    '/kcsapi/api_get_member/unsetslot': (req, res) => {  },

    '/kcsapi/api_port/port': (req, res) => {
        let apidata = res.api_data;
        BasicInfo.update(apidata.api_basic);
        Resource.update(apidata.api_material);

        Ships.update(apidata.api_ship);

        ShipDeck.update(apidata.api_deck_port);
        RepairDock.update(apidata.api_ndock);
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
                let req       = trigger.request,  //JSON.parse(trigger.request),
                    res       = JSON.parse(trigger.response),
                    processer = triggerProcesser[trigger.path];
                processer(req, res);
            }
        }
        this.execting = false;
    }
    watch(md, method) {
        if(!watchList[md.modelname]) {
            watchList[md.modelname] = [];//new Set();
        }
        watchList[md.modelname].push(method);

        return this;
    }
    unwatch(md, method) {
        if(watchList[md.modelname]) {
            let index = watchList[md.modelname].indexOf(method);
            if(index >= 0) {
                watchList[md.modelname].splice(index, 1);
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

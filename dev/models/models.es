import BaseModel from './base';

let modellist = {
    'EquipType': './data/equiptype',
    'MapArea'  : './data/maparea',
    'MapCell'  : './data/mapcell',
    'MapInfo'  : './data/mapinfo',
    'Mission'  : './data/mission',
    'ShipInfo' : './data/shipinfo',
    'ShipType' : './data/shiptype',
    'SlotItem' : './data/slotitem',

    'BasicInfo'    : './record/basicinfo',
    'ConstructDock': './record/constructdock',
    'Equips'       : './record/equips',
    'Quest'        : './record/quest',
    'RepairDock'   : './record/repairdock',
    'Resource'     : './record/resource',
    'ShipDeck'     : './record/shipdeck',
    'Ships'        : './record/ships'
};

class Model extends BaseModel {
    constructor() {
        super();
        this.modelname = 'ModelManager';
    }
    get(modelname) {
        if(!this.has(modelname)) {
            if(modellist[modelname]) { this.map.set(modelname, require(modellist[modelname])); }
            else {
                error(`Model [${modelname}] not aliveble`);
                return null;
            }
        }
        return this.map.get(modelname);
    }
}

export default new Model();

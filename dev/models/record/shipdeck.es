import BaseModel from '../base';
import Ships     from './ships';
import Mission   from '../data/mission';
import Gene      from '../general';

let getShip = (apiship) => {
        let ships = [];
        for(let index in apiship) {
            ships.push(Ships.get(apiship[index]));
        }
        return ships;
    },
    getMission = (apimission) => {
        let ms = { name: '' };
        ms.state = Gene.getMissionState(apimission[0]);
        ms.complateTime = apimission[2];
        if (apimission[0] !== 0) {
            ms.name = Mission.get(apimission[1]).name;
        }
        return ms;
    };

class ShipDeck extends BaseModel {
    constructor() {
        super();
        this.modelname = 'ShipDeck';
        this.addDependency(Mission);
    }
    parse(deck_data) {
        let deck = {
            id     : deck_data.api_id,
            name   : deck_data.api_name,
            ship   : getShip(deck_data.api_ship),
            mission: getMission(deck_data.api_mission)
        };
        return deck;
    }
    setMission(deckid, missionid, complatetime) {
        let deck = this.get(deckid);
        if(missionid) { deck.mission.name = Mission.get(missionid).name; }
        deck.mission.complateTime = complatetime;
        if(complatetime === 0) {
            Gene.getMissionState(2);
        }
        else {
            Gene.getMissionState(1);
        }
    }
}

export default new ShipDeck();

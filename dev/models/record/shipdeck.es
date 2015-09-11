import BaseModel from '../base';
import Ships     from './ships';

let convertShip = (apiship) => {
    let ships = [];
    for(let index in apiship) {
        ships.push(Ships.get(apiship[index]));
    }
    return ships;
};

class ShipDeck extends BaseModel {
    constructor() {
        super();
        this.modelname = 'ShipDeck';
    }
    parse(deck_data) {
        let deck = {
            id  : deck_data.api_id,
            name: deck_data.api_name,
            ship: convertShip(deck_data.api_ship)
        };
        return deck;
    }
}

export default new ShipDeck();

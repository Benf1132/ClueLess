import { CardType } from './GameEnums.js';

class Card {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }

    // Getter for type
    getType() {
        return this.type;
    }

    // Getter for name
    getName() {
        return this.name;
    }

    // toString method for easy printing
    toString() {
        return `${this.name} (${this.type})`;
    }
}

export default Card;

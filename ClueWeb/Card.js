import { CardType, CharacterName, WeaponName, RoomName } from './GameEnums.js';

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

    // Method to get the image path
    getImagePath() {
        let imagePath = '';
        switch (this.type) {
            case CardType.SUSPECT:
                imagePath = CharacterName[this.name]?.imagePath || null;
                break;
            case CardType.WEAPON:
                imagePath = WeaponName[this.name]?.imagePath || null;
                break;
            case CardType.ROOM:
                imagePath = RoomName[this.name]?.imagePath || null;
                break;
            default:
                imagePath = 'images/default.png';
        }
        return imagePath;
    }

    // toString method for easy printing
    toString() {
        return `${this.name} (${this.type})`;
    }
}

export default Card;

import { CardType, CharacterName, WeaponName, RoomName, getEnumName } from './GameEnums.js';

class Card {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }

    // Getter for type
    getType() {
        return this.type;
    }

    // Enhanced getter for name to return the enum display name using getEnumName
    getName() {
        switch (this.type) {
            case CardType.SUSPECT:
                return getEnumName(CharacterName, this.name);
            case CardType.WEAPON:
                return getEnumName(WeaponName, this.name);
            case CardType.ROOM:
                return getEnumName(RoomName, this.name);
            default:
                return this.name;  // Fallback in case type doesn't match any known enum
        }
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

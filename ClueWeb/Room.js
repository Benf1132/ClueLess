import Tile from './Tile.js'; 
import { TileType, RoomName } from './GameEnums.js';

class Room extends Tile {
    constructor(row, column, roomType) {
        super(row, column, TileType.ROOM);
        this.roomType = roomType;
        this.name = RoomName[this.roomType].name;
        this.imagePath = RoomName[this.roomType].imagePath;
        this.isCorner = this.checkIfCornerRoom(row, column); // Hardcoded check for corner rooms
        this.characters = [];
        this.weapons = [];
    }

    checkIfCornerRoom(row, column) {
        const cornerPositions = [
            { row: 1, col: 1 },
            { row: 1, col: 5 },
            { row: 5, col: 1 },
            { row: 5, col: 5 }
        ];
        return cornerPositions.some(pos => pos.row === row && pos.col === column);
    }

    addCharacter(character) {
        this.characters.push(character);
    }

    removeCharacter(character) {
        this.characters = this.characters.filter(c => c !== character);
    }

    addWeapon(weapon) {
        this.weapons.push(weapon);
    }

    removeWeapon(weapon) {
        this.weapons = this.weapons.filter(w => w !== weapon);
    }

    getCharacters() {
        return this.characters;
    }

    getWeapons() {
        return this.weapons;
    }
}

export default Room;

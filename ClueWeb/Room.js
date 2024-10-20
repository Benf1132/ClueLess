import Tile from './Tile.js';
import { TileType } from './GameEnums.js';

class Room extends Tile {
    constructor(row, column, roomName) {
        super(row, column, TileType.ROOM);
        this.roomName = roomName;
        this.characters = [];
        this.weapons = [];
    }

    getRoomName() {
        return this.roomName;
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

    setNeighbors(...tiles) {
        if (this.roomName === 'Billiard Room') {
            super.setNeighbors(...tiles);
        } else {
            super.setNeighbors(...tiles.slice(0, 3));
        }
    }
}

export default Room;

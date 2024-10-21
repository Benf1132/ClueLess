import Tile from './Tile.js'; 
import { TileType, RoomName } from './GameEnums.js';

class Room extends Tile {
    constructor(row, column, roomType) {
        super(row, column, TileType.ROOM);
        this.roomType = roomType;
        this.name = RoomName[this.roomType].name;            
        this.imagePath = RoomName[this.roomType].imagePath;
        this.isCorner = this.checkIfCornerRoom(row, column);
        this.characters = [];
        this.weapons = [];
        this.setRoomBackgroundImage();
    }
    checkIfCornerRoom(row, column) {
        // Define the corner room positions
        const cornerPositions = [
            { row: 1, col: 1 },
            { row: 1, col: 5 },
            { row: 5, col: 1 },
            { row: 5, col: 5 }
        ];
        return cornerPositions.some(pos => pos.row === row && pos.col === column);
    }

    getRoomName() {
        return this.name;
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
        // Custom logic for setting neighbors can remain as is
        super.setNeighbors(...tiles);
    }

    // Method to set the background image of the room tile
    setRoomBackgroundImage() {
        if (this.element && this.imagePath) {
            this.element.style.backgroundImage = `url('${this.imagePath}')`;
        }
    }
}

export default Room;

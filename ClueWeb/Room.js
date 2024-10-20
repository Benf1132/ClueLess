import Tile from './Tile.js'; 
import { TileType, RoomName } from './GameEnums.js';

class Room extends Tile {
    constructor(row, column, roomType) {
        super(row, column, TileType.ROOM);
        this.roomType = roomType;

        // Get the room's display name and image path from the RoomName enum
        if (RoomName[this.roomType]) {
            this.name = RoomName[this.roomType].name;
            this.imagePath = RoomName[this.roomType].imagePath;
        } else {
            console.error(`Room type ${this.roomType} not found in RoomName enum.`);
            this.name = 'Unknown Room';
            this.imagePath = 'images/tiles/default.jpg';
        }

        this.characters = [];
        this.weapons = [];

        // Optionally, set the background image of the room tile
        this.setRoomBackgroundImage();
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

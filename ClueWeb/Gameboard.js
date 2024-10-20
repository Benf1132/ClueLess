import { RoomName, TileType, WeaponName } from './GameEnums.js';
import Deck from './Deck.js';
import Player from './Player.js';
import Room from './Room.js';
import StartSquare from './StartSquare.js';
import Hallway from './Hallway.js';
import OutOfBounds from './OutOfBounds.js';
import Weapon from './Weapon.js';

class Gameboard {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.tiles = new Array(rows).fill(null).map(() => new Array(columns).fill(null));
        this.players = [];
        this.weapons = [];
        this.rooms = [];
        this.deck = new Deck();
        this.envelope = this.deck.envelopeCardPicker();

        this.initializeTiles();
        this.setNeighbors();
        this.initializePlaceholderPlayers();
        this.initializeWeapons();
        this.deck.dealCards(this.players);
    }

    getPlayers() {
        return this.players;
    }

    initializePlaceholderPlayers() {
        for (let i = 0; i < 6; i++) {
            this.players.push(new Player());
        }
    }

    initializeTiles() {
        const tiles = document.querySelectorAll('.tile'); // Select all tiles in the grid
        tiles.forEach(tile => {
            const row = parseInt(tile.getAttribute('data-row'), 10);
            const col = parseInt(tile.getAttribute('data-col'), 10);

            let tileObj;
            if (tile.classList.contains('room')) {
                const roomClass = tile.classList[2]; // The third class is the room type
                const roomTypeKey = roomClass.toUpperCase().replace('-', '_');
                tileObj = new Room(row, col, roomTypeKey);
                this.rooms.push(tileObj);
            } else if (tile.classList.contains('start-square')) {
                tileObj = new StartSquare(row, col);
            } else if (tile.classList.contains('hallway')) {
                tileObj = new Hallway(row, col);
            } else {
                tileObj = new OutOfBounds(row, col);
            }

            this.tiles[row][col] = tileObj;
            tileObj.element = tile;  // Attach the DOM element to the tile object
        });
    }

    setNeighbors() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const current = this.tiles[row][col];
                const up = this.getTile(row - 1, col);
                const down = this.getTile(row + 1, col);
                const left = this.getTile(row, col - 1);
                const right = this.getTile(row, col + 1);

                if (current instanceof StartSquare) {
                    this.assignStartSquareNeighbors(current, up, down, left, right);
                } else if (current instanceof Hallway) {
                    this.assignHallwayNeighbors(current, up, down, left, right);
                } else if (current instanceof Room) {
                    this.assignRoomNeighbors(current, up, down, left, right);
                }
            }
        }
    }

    assignStartSquareNeighbors(square, up, down, left, right) {
        const neighbors = [up, down, left, right].filter(tile => tile instanceof Hallway);
        square.setNeighbors(...neighbors);
    }

    assignHallwayNeighbors(hallway, up, down, left, right) {
        const neighbors = [up, down, left, right].filter(tile => tile instanceof Room);
        hallway.setNeighbors(...neighbors);
    }

    assignRoomNeighbors(room, up, down, left, right) {
        const neighbors = [up, down, left, right].filter(tile => tile instanceof Hallway);
        room.setNeighbors(...neighbors);
    }

    getTile(row, col) {
        return (row >= 0 && row < this.rows && col >= 0 && col < this.columns) ? this.tiles[row][col] : null;
    }

    initializeWeapons() {
        const weaponTypes = Object.keys(WeaponName);
        const shuffledRooms = [...this.rooms].sort(() => Math.random() - 0.5);

        weaponTypes.forEach((weaponType, index) => {
            const room = shuffledRooms[index % shuffledRooms.length];
            const weapon = new Weapon(room, weaponType);
            this.weapons.push(weapon);
            room.addWeapon(weapon);

            console.log(`Placed ${weapon.getWeaponName()} in ${room.getRoomName()}`);
        });
    }

    movePlayer(player, newTile) {
        const character = player.getCharacter();
        character.move(newTile);

        // Update the character's position in the DOM
        const characterImg = character.getCharacterImageView();
        const newTileElement = newTile.element;
        if (characterImg && newTileElement) {
            // Remove the character from the previous tile
            const prevTileElement = character.getPreviousTile()?.element;
            if (prevTileElement) prevTileElement.removeChild(characterImg);

            // Add the character to the new tile
            newTileElement.appendChild(characterImg);
        }
    }
}

export { Gameboard };

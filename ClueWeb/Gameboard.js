import { RoomName, TileType, WeaponName, CharacterName, getEnumName } from './GameEnums.js';
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

    // Access all character names directly from CharacterName enum
    getCharacterNames() {
        return Object.keys(CharacterName).map(key => getEnumName(CharacterName, key));
    }

    // Access all weapon names directly from WeaponName enum
    getWeaponNames() {
        return Object.keys(WeaponName).map(key => getEnumName(WeaponName, key));
    }

    // Access all room names directly from RoomName enum
    getRoomNames() {
        return Object.keys(RoomName).map(key => getEnumName(RoomName, key));
    }

    matchCharacter(characterName) {
        return Object.values(CharacterName).find(character => getEnumName(CharacterName, character.name) === characterName) || null;
    }

    matchWeapon(weaponName) {
        return Object.values(WeaponName).find(weapon => getEnumName(WeaponName, weapon.name) === weaponName) || null;
    }

    matchRoom(roomName) {
        return Object.values(RoomName).find(room => getEnumName(RoomName, room.name) === roomName) || null;
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

            // Overwrite the tile at the specific position
            this.tiles[row][col] = tileObj;
            tileObj.element = tile;  // Attach the DOM element to the tile object
        });
    }

    setNeighbors() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const current = this.tiles[row][col];
                const neighbors = {
                    'up': this.getTile(row - 1, col),
                    'down': this.getTile(row + 1, col),
                    'left': this.getTile(row, col - 1),
                    'right': this.getTile(row, col + 1)
                };

                this.assignNeighbors(current, neighbors);
            }
        }
    }

    assignNeighbors(tile, neighbors) {
        const validNeighbors = {};

        for (const [direction, neighborTile] of Object.entries(neighbors)) {
            if (tile instanceof StartSquare && neighborTile instanceof Hallway) {
                validNeighbors[direction] = neighborTile;
            } else if (tile instanceof Hallway && (neighborTile instanceof Room || neighborTile instanceof Hallway)) {
                validNeighbors[direction] = neighborTile;
            } else if (tile instanceof Room && neighborTile instanceof Hallway) {
                validNeighbors[direction] = neighborTile;
            }
        }

        // Handle secret passages or corner rooms for Room tiles
        if (tile instanceof Room && tile.isCornerRoom) {
            const oppositeRoom = this.getOppositeCornerRoom(tile);
            if (oppositeRoom) {
                validNeighbors['secret'] = oppositeRoom;
            }
        }

        tile.setNeighbors(validNeighbors);
    }

    getOppositeCornerRoom(room) {
        const oppositePositions = {
            '1,1': { row: 5, col: 5 },
            '1,5': { row: 5, col: 1 },
            '5,1': { row: 1, col: 5 },
            '5,5': { row: 1, col: 1 }
        };

        const key = `${room.row},${room.column}`;
        const oppositeCoord = oppositePositions[key];

        return this.getRoomByPosition(oppositeCoord.row, oppositeCoord.col);
    }

    getRoomByPosition(row, col) {
        return this.rooms.find(room => room.row === row && room.column === col);
    }

    getTile(row, col) {
        return (row >= 0 && row < this.rows && col >= 0 && col < this.columns)
            ? this.tiles[row][col]
            : null;
    }

    initializeWeapons() {
        const weaponTypes = Object.keys(WeaponName);
        const shuffledRooms = [...this.rooms].sort(() => Math.random() - 0.5);

        weaponTypes.forEach((weaponType, index) => {
            const room = shuffledRooms[index % shuffledRooms.length];
            const weapon = new Weapon(room, weaponType);
            this.weapons.push(weapon);
            room.addWeapon(weapon);
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
            if (prevTileElement && prevTileElement.contains(characterImg)) {
                prevTileElement.removeChild(characterImg);
            }

            // Add the character to the new tile
            newTileElement.appendChild(characterImg);
        }
    }
}

export { Gameboard };

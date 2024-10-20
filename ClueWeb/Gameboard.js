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
    
    // Add this method to return players
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
                tileObj = new Room(row, col, RoomName[roomClass.toUpperCase().replace('-', '_')]);
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
            console.log(`Tile at row ${row}, col ${col} initialized as ${tileObj.constructor.name}`);
        });
    }

    determineTileType(row, col) {
        if ((row === 0 && col === 4) || (row === 2 && col === 0) || (row === 4 && col === 0) ||
            (row === 6 && col === 4) || (row === 2 && col === 6) || (row === 6 && col === 2)) {
            return TileType.STARTING_SQUARE;
        }
        if ((row === 1 && (col === 1 || col === 3 || col === 5)) || 
            (row === 3 && (col === 1 || col === 3 || col === 5)) ||
            (row === 5 && (col === 1 || col === 3 || col === 5))) {
            return TileType.ROOM;
        }
        if ((row === 1 && (col === 2 || col === 4)) || 
            (row === 2 && (col === 1 || col === 3 || col === 5)) ||
            (row === 3 && (col === 2 || col === 4)) || 
            (row === 4 && (col === 1 || col === 3 || col === 5)) || 
            (row === 5 && (col === 2 || col === 4))) {
            return TileType.HALLWAY;
        }
        return TileType.OUT_OF_BOUNDS;
    }

    determineRoomName(row, col) {
        if (row === 3 && col === 3) return 'BILLIARD_ROOM';
        if (row === 1 && col === 1) return 'STUDY';
        if (row === 1 && col === 3) return 'HALL';
        if (row === 1 && col === 5) return 'LOUNGE';
        if (row === 3 && col === 1) return 'LIBRARY';
        if (row === 3 && col === 5) return 'DINING_ROOM';
        if (row === 5 && col === 1) return 'CONSERVATORY';
        if (row === 5 && col === 3) return 'BALLROOM';
        if (row === 5 && col === 5) return 'KITCHEN';
        return 'STUDY';  // Default fallback
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
        const weaponNames = Object.keys(WeaponName);
        const shuffledRooms = [...this.rooms].sort(() => Math.random() - 0.5);

        weaponNames.forEach((weaponName, index) => {
            const randomRoom = shuffledRooms[index];
            const weapon = new Weapon(randomRoom, weaponName);
            this.weapons.push(weapon);
            randomRoom.addWeapon(weapon);

            const weaponImg = document.createElement('img');
            weaponImg.src = weapon.getImagePath();
            weaponImg.classList.add('weapon-image');
            randomRoom.element.appendChild(weaponImg);
        });
    }

    movePlayer(player, newTile) {
        const character = player.getCharacter();
        character.move(newTile);

        const characterImg = character.getCharacterImageView();
        const newTileElement = newTile.element;
        if (characterImg && newTileElement) {
            const prevTileElement = character.getPreviousTile()?.element;
            if (prevTileElement) prevTileElement.removeChild(characterImg);
            newTileElement.appendChild(characterImg);
        }
    }
}

export { Gameboard };

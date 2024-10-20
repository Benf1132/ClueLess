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
        // Initialize all positions with OutOfBounds tiles
        this.tiles = new Array(rows).fill(null).map((_, row) =>
            new Array(columns).fill(null).map((_, col) => new OutOfBounds(row, col))
        );
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

    getCharacterNames() {
        return this.players
            .filter(player => player.getCharacter() !== null)
            .map(player => player.getCharacter().getCharacterName());
    }

    getWeaponNames() {
        return this.weapons.map(weapon => weapon.getWeaponName());
    }

    getRoomNames() {
        return this.rooms.map(room => room.getRoomName());
    }

    matchCharacter(characterName) {
        const player = this.players.find(player => player.getCharacter() && player.getCharacter().getCharacterName() === characterName);
        return player ? player.getCharacter() : null;
    }

    matchWeapon(weaponName) {
        return this.weapons.find(weapon => weapon.getWeaponName() === weaponName);
    }

    matchRoom(roomName) {
        return this.rooms.find(room => room.getRoomName() === roomName);
    }

    initializePlaceholderPlayers() {
        for (let i = 0; i < 6; i++) {
            const player = new Player();
            // No need to set character here; it defaults to null
            this.players.push(player);
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

        // Assign opposite corner rooms as neighbors
        this.assignOppositeCornerNeighbors();
    }

    assignStartSquareNeighbors(square, up, down, left, right) {
        const neighbors = [up, down, left, right]
            .filter(tile => tile !== null && tile instanceof Hallway);
        square.setNeighbors(...neighbors.slice(0, 1)); // Start squares only have 1 neighbor
    }

    assignHallwayNeighbors(hallway, up, down, left, right) {
        const neighbors = [up, down, left, right]
            .filter(tile => tile !== null && (tile instanceof Room || tile instanceof Hallway));
        hallway.setNeighbors(...neighbors.slice(0, 2)); // Hallways can have up to 2 neighbors
    }

    assignRoomNeighbors(room, up, down, left, right) {
        let neighbors = [up, down, left, right]
            .filter(tile => tile !== null && tile instanceof Hallway);

        // Special case for corner rooms
        if (room.isCorner()) {
            const oppositeCorner = this.getOppositeCornerRoom(room);
            if (oppositeCorner) {
                neighbors.push(oppositeCorner);
            }
        }

        // Special case for the billiard room
        if (room.getRoomName() === 'BILLIARD_ROOM') {
            neighbors = [up, down, left, right]
                .filter(tile => tile !== null && tile instanceof Hallway);
        }

        room.setNeighbors(...neighbors.slice(0, 4)); // Rooms can have up to 4 neighbors
    }

    assignOppositeCornerNeighbors() {
        const cornerRooms = {
            'STUDY': this.rooms.find(room => room.getRoomName() === 'STUDY'),
            'KITCHEN': this.rooms.find(room => room.getRoomName() === 'KITCHEN'),
            'LOUNGE': this.rooms.find(room => room.getRoomName() === 'LOUNGE'),
            'CONSERVATORY': this.rooms.find(room => room.getRoomName() === 'CONSERVATORY')
        };

        if (cornerRooms['STUDY'] && cornerRooms['KITCHEN']) {
            cornerRooms['STUDY'].addNeighbor(cornerRooms['KITCHEN']);
        }
        if (cornerRooms['KITCHEN'] && cornerRooms['STUDY']) {
            cornerRooms['KITCHEN'].addNeighbor(cornerRooms['STUDY']);
        }
        if (cornerRooms['LOUNGE'] && cornerRooms['CONSERVATORY']) {
            cornerRooms['LOUNGE'].addNeighbor(cornerRooms['CONSERVATORY']);
        }
        if (cornerRooms['CONSERVATORY'] && cornerRooms['LOUNGE']) {
            cornerRooms['CONSERVATORY'].addNeighbor(cornerRooms['LOUNGE']);
        }
    }

    getOppositeCornerRoom(room) {
        const cornerRooms = {
            'STUDY': 'KITCHEN',
            'KITCHEN': 'STUDY',
            'LOUNGE': 'CONSERVATORY',
            'CONSERVATORY': 'LOUNGE'
        };

        const oppositeRoomName = cornerRooms[room.getRoomName()];
        if (oppositeRoomName) {
            return this.rooms.find(r => r.getRoomName() === oppositeRoomName);
        }
        return null;
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

    // Debugging method to log neighbors of each tile
    debugNeighbors() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const tile = this.getTile(row, col);
                if (tile) {
                    const neighbors = tile.getNeighbors()
                        .filter(neighbor => neighbor !== null)
                        .map(neighbor => `(${neighbor.row}, ${neighbor.column})`).join(', ');
                    console.log(`Tile (${row}, ${col}) neighbors: ${neighbors}`);
                }
            }
        }
    }
}

export { Gameboard };

// Import necessary classes and enums
import { RoomName, TileType, WeaponName } from './GameEnums.js';
import Deck from './Deck.js';
import Player from './Player.js';  // Assuming you have a Player class
import Room from './Room.js';
import StartSquare from './StartSquare.js';  // Changed StartingSquare to StartSquare
import Hallway from './Hallway.js';
import OutOfBounds from './OutOfBounds.js';
import Weapon from './Weapon.js';
import Envelope from './Envelope.js'; 

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

    initializePlaceholderPlayers() {
        for (let i = 0; i < 6; i++) {
            this.players.push(new Player()); // Placeholder players
        }
    }

    initializeTiles() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const tileId = `tile${row}_${col}`;
                const tileDiv = document.getElementById(tileId);  // Get the existing tile from the HTML
    
                let tile;
                const tileType = this.determineTileType(row, col);
    
                tileDiv.classList.add('tile');  // Ensure it has the tile class
    
                switch (tileType) {
                    case TileType.ROOM:
                        const roomName = this.determineRoomName(row, col);
                        tile = new Room(row, col, RoomName[roomName]);
                        tileDiv.classList.add(roomName.toLowerCase().replace(/\s+/g, '-'));  // Add the appropriate CSS class
                        this.rooms.push(tile);
                        break;
                    case TileType.STARTING_SQUARE:
                        tile = new StartSquare(row, col);
                        tileDiv.classList.add('start-square');
                        break;
                    case TileType.HALLWAY:
                        tile = new Hallway(row, col);
                        tileDiv.classList.add('hallway');
                        break;
                    default:
                        tile = new OutOfBounds(row, col);
                        tileDiv.classList.add('out-of-bounds');
                        break;
                }
    
                this.tiles[row][col] = tile;  // Store the tile in the tiles array
                tile.element = tileDiv;  // Associate the tile with its DOM element
            }
        }
    }



    setNeighbors() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const current = this.tiles[row][col];
                const up = this.getTile(row - 1, col);
                const down = this.getTile(row + 1, col);
                const left = this.getTile(row, col - 1);
                const right = this.getTile(row, col + 1);

                if (current instanceof StartSquare) {  // Changed StartingSquare to StartSquare
                    this.assignStartSquareNeighbors(current, up, down, left, right);
                } else if (current instanceof Hallway) {
                    this.assignHallwayNeighbors(current, up, down, left, right);
                } else if (current instanceof Room) {
                    this.assignRoomNeighbors(current, up, down, left, right);
                }
            }
        }
    }

    assignStartSquareNeighbors(square, up, down, left, right) {  // Changed StartingSquare to StartSquare
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
        // Determine room names based on positions
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


    getTile(row, col) {
        return (row >= 0 && row < this.rows && col >= 0 && col < this.columns) ? this.tiles[row][col] : null;
    }

    initializeWeapons() {
        const weaponNames = Object.keys(WeaponName);  // Get the keys (names) of the weapons
        const shuffledRooms = [...this.rooms].sort(() => Math.random() - 0.5);  // Shuffle rooms
    
        weaponNames.forEach((weaponName, index) => {
            const randomRoom = shuffledRooms[index];
            const weapon = new Weapon(randomRoom, weaponName);  // Pass the weapon name as a string
            this.weapons.push(weapon);
            randomRoom.addWeapon(weapon);
    
            // Create the img element for the weapon and append it to the room's tile
            const weaponImg = document.createElement('img');
            weaponImg.src = weapon.getImagePath();  // Use the correct method to get the image path
            weaponImg.classList.add('weapon-image');
            randomRoom.element.appendChild(weaponImg);  // Append the img to the room's tile
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

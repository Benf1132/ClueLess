import Tile from './Tile.js';
import { TileType } from './GameEnums.js';

class Hallway extends Tile {
    constructor(row, column) {
        super(row, column, TileType.HALLWAY);
        this.occupied = false;
    }

    setNeighbors(...tiles) {
        super.setNeighbors(...tiles.slice(0, 2)); // Hallways only have 2 neighbors
    }

    isOccupied() {
        return this.occupied;
    }

    setOccupied(occupied) {
        this.occupied = occupied;
    }
}

export default Hallway;

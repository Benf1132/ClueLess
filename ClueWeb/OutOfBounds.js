import Tile from './Tile.js';
import { TileType } from './GameEnums.js';

class OutOfBounds extends Tile {
    constructor(row, column) {
        super(row, column, TileType.OUT_OF_BOUNDS);
    }

    setNeighbors() {
        // No neighbors for out-of-bounds tiles
        super.setNeighbors();
    }
}

export default OutOfBounds;

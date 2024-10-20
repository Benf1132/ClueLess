import Tile from './Tile.js';
import { TileType } from './GameEnums.js';

class StartSquare extends Tile {
    constructor(row, column) {
        super(row, column, TileType.STARTING_SQUARE);
    }

    setNeighbors(...tiles) {
        super.setNeighbors(tiles.slice(0, 1)); // Starting square has 1 neighbor
    }
}

export default StartSquare;

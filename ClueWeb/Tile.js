import { TileType } from './GameEnums.js';

class Tile {
    constructor(row, column, type) {
        this.row = row;
        this.column = column;
        this.type = type;
        this.neighbors = {};
    }

    setNeighbors(neighbors) {
        this.neighbors = neighbors;
    }

    getNeighbor(direction) {
        return this.neighbors[direction] || null;
    }

    getNeighbors() {
        return this.neighbors;
    }

    getRow() {
        return this.row;
    }

    getColumn() {
        return this.column;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    isCorner() {
        return (this.row === 1 && this.column === 1) || 
               (this.row === 1 && this.column === 5) || 
               (this.row === 5 && this.column === 1) || 
               (this.row === 5 && this.column === 5);
    }
}

export default Tile;

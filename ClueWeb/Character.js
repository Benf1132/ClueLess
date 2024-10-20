import { CharacterName } from './GameEnums.js';
import Hallway from './Hallway.js';
import Room from './Room.js';

class Character {
    constructor(currentTile, name) {
        this.currentTile = currentTile;
        this.previousTile = null;
        this.name = name;

        // Create the character image element based on the name from CharacterName Enum
        if (CharacterName[this.name]) {
            this.characterImageElement = document.createElement('img');
            this.characterImageElement.src = CharacterName[this.name].imagePath;  // Set the image path from the enum
            this.characterImageElement.classList.add('character-image');
            this.addCharacterToTile();
        } else {
            console.error(`Character name ${this.name} not found in CharacterName enum.`);
        }
    }

    getCharacterName() {
        return this.name;
    }

    getCurrentTile() {
        return this.currentTile;
    }

    getPreviousTile() {
        return this.previousTile;
    }

    move(newTile) {
        if (newTile instanceof Hallway && newTile.isOccupied()) {
            console.warn(`Cannot move ${this.name} to an occupied hallway.`);
            return;
        }

        if (this.currentTile instanceof Room) {
            this.currentTile.removeCharacter(this);
        }

        this.previousTile = this.currentTile;

        if (this.currentTile instanceof Hallway) {
            this.currentTile.setOccupied(false);
        }

        this.currentTile = newTile;

        if (newTile instanceof Hallway) {
            newTile.setOccupied(true);
        }

        this.addCharacterToTile();
    }

    undoMove() {
        if (this.previousTile) {
            if (this.currentTile instanceof Room) {
                this.currentTile.removeCharacter(this);
            }

            this.currentTile = this.previousTile;

            if (this.currentTile instanceof Hallway) {
                this.currentTile.setOccupied(true);
            }

            this.previousTile = null;
            this.addCharacterToTile();
        }
    }

    addCharacterToTile() {
        // Use querySelector to find the tile with matching data-row and data-col attributes
        const tileElement = document.querySelector(`.tile[data-row="${this.currentTile.row}"][data-col="${this.currentTile.column}"]`);
        if (tileElement) {
            tileElement.appendChild(this.characterImageElement);
        } else {
            console.error(`Tile at row: ${this.currentTile.row}, column: ${this.currentTile.column} not found.`);
        }
    }


    getCharacterImageView() {
        return this.characterImageElement;
    }
}

export default Character;

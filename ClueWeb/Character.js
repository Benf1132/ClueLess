import { CharacterName } from './GameEnums.js';
import Hallway from './Hallway.js';
import Room from './Room.js';

class Character {
    constructor(currentTile, name) {
        this.currentTile = currentTile;
        this.previousTile = null;
        this.name = name;

        // Create the character image element
        this.characterImageElement = document.createElement('img');
        this.characterImageElement.src = CharacterName[name].imagePath;
        this.characterImageElement.classList.add('character-image');

        // Add the character to the initial tile
        this.addCharacterToTile();
    }

    // Getter for the character's name
    getCharacterName() {
        return this.name;
    }

    // Getter for the current tile
    getCurrentTile() {
        return this.currentTile;
    }

    // Getter for the previous tile
    getPreviousTile() {
        return this.previousTile;
    }

    // Move the character to a new tile
    move(newTile) {
        // If the new tile is a hallway and it's occupied, don't move
        if (newTile instanceof Hallway && newTile.isOccupied()) {
            return;
        }

        if (this.currentTile) {
            // If the new tile is a room, add the character to the room's list
            if (newTile instanceof Room) {
                newTile.addCharacter(this);
            }

            // If the current tile is a room, remove the character from the room
            if (this.currentTile instanceof Room) {
                this.currentTile.removeCharacter(this);
            }

            // Update previous tile before moving
            this.previousTile = this.currentTile;

            // If the current tile is a hallway, mark it as not occupied
            if (this.currentTile instanceof Hallway) {
                this.currentTile.setOccupied(false);
            }

            // Move to the new tile
            this.currentTile = newTile;

            // If the new tile is a hallway, mark it as occupied
            if (newTile instanceof Hallway) {
                newTile.setOccupied(true);
            }

            // Update the DOM to reflect the character's new position
            this.addCharacterToTile();
        }
    }

    // Undo the character's move
    undoMove() {
        if (this.previousTile) {
            // If the current tile is a room, remove the character from the room
            if (this.currentTile instanceof Room) {
                this.currentTile.removeCharacter(this);
            }

            // If the previous tile is a room, add the character back to the room
            if (this.previousTile instanceof Room) {
                this.previousTile.addCharacter(this);
            }

            // If the current tile is a hallway, mark it as not occupied
            if (this.currentTile instanceof Hallway) {
                this.currentTile.setOccupied(false);
            }

            // Move back to the previous tile
            this.currentTile = this.previousTile;

            // If the previous tile is a hallway, mark it as occupied
            if (this.currentTile instanceof Hallway) {
                this.currentTile.setOccupied(true);
            }

            // Clear the previous tile after undoing
            this.previousTile = null;

            // Update the DOM to reflect the character's position
            this.addCharacterToTile();
        }
    }

    // Add the character to the current tile in the DOM
    addCharacterToTile() {
        const tileElement = document.getElementById(`tile${this.currentTile.row}_${this.currentTile.column}`);
        tileElement.appendChild(this.characterImageElement);
    }

    // Clear previous tile reference (at end of player's turn)
    resetPreviousTile() {
        this.previousTile = null;
    }
}

export default Character;

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
        this.characterImageElement.src = CharacterName[name].imagePath;  // Make sure image paths are properly set in GameEnums
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
        // Check if the new tile is a hallway and occupied, don't move if occupied
        if (newTile instanceof Hallway && newTile.isOccupied()) {
            console.warn(`Cannot move ${this.name} to an occupied hallway.`);
            return;
        }

        // Remove the character from the current tile
        if (this.currentTile) {
            // If the new tile is a room, add the character to the room's list
            if (newTile instanceof Room) {
                newTile.addCharacter(this);
            }

            // If the current tile is a room, remove the character from the room
            if (this.currentTile instanceof Room) {
                this.currentTile.removeCharacter(this);
            }

            // Update the previous tile before moving
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
        if (tileElement) {
            tileElement.appendChild(this.characterImageElement);
        } else {
            console.error(`Tile at row: ${this.currentTile.row}, column: ${this.currentTile.column} not found.`);
        }
    }

    // Clear previous tile reference at the end of a player's turn
    resetPreviousTile() {
        this.previousTile = null;
    }

    // Get the character's DOM image element
    getCharacterImageView() {
        return this.characterImageElement;
    }
}

export default Character;

import { WeaponName } from './GameEnums.js';

class Weapon {
    constructor(currentTile, name) {
        this.currentTile = currentTile;
        this.name = name;

        // Create an img element for the weapon image
        this.weaponImage = document.createElement('img');
        this.weaponImage.src = this.getImagePath();
        this.weaponImage.classList.add('weapon-image');

        // Add the image to the current tile
        this.updateImageViewPosition();
    }

    // Method to get the image path of the weapon
    getImagePath() {
        return `images/weapons/${this.name.toLowerCase().replace(/\s+/g, '_')}.png`;
    }

    // Get the current tile of the weapon
    getCurrentTile() {
        return this.currentTile;
    }

    // Set a new current tile for the weapon
    setCurrentTile(newTile) {
        this.currentTile = newTile;
        this.updateImageViewPosition();
    }

    // Update the position of the weapon image inside the current tile (bottom-right alignment)
    updateImageViewPosition() {
        if (this.currentTile) {
            // Remove the image from the previous tile if needed
            const previousTile = document.getElementById(`tile${this.currentTile.row}_${this.currentTile.column}`);
            if (previousTile) {
                previousTile.removeChild(this.weaponImage);
            }

            // Add the image to the new tile
            const newTileElement = document.getElementById(`tile${this.currentTile.row}_${this.currentTile.column}`);
            if (newTileElement) {
                newTileElement.appendChild(this.weaponImage);
            }
        }
    }
}

export default Weapon;

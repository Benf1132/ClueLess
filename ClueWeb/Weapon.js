import { WeaponName } from './GameEnums.js';

class Weapon {
    constructor(currentTile, weaponType) {
        this.currentTile = currentTile;
        this.weaponType = weaponType;

        // Get the weapon's display name and image path from the WeaponName enum
        if (WeaponName[this.weaponType]) {
            this.name = WeaponName[this.weaponType].name;
            this.imagePath = WeaponName[this.weaponType].imagePath;
        } else {
            console.error(`Weapon type ${this.weaponType} not found in WeaponName enum.`);
            this.name = 'Unknown Weapon';
            this.imagePath = 'images/weapons/default.png';
        }

        // Create an img element for the weapon image
        this.weaponImage = document.createElement('img');
        this.weaponImage.src = this.imagePath;
        this.weaponImage.alt = this.name;
        this.weaponImage.classList.add('weapon-image');

        // Add the weapon image to the current tile
        this.addWeaponToTile();
    }

    // Method to add the weapon image to the tile
    addWeaponToTile() {
        const tileElement = this.currentTile.element;
        if (tileElement) {
            // Remove weapon image from previous tile if necessary
            if (this.weaponImage.parentElement && this.weaponImage.parentElement !== tileElement) {
                this.weaponImage.parentElement.removeChild(this.weaponImage);
            }

            tileElement.appendChild(this.weaponImage);
            console.log(`Placed ${this.name} on tile: ${this.currentTile.row}, ${this.currentTile.column}`);
        } else {
            console.error(`Tile at row: ${this.currentTile.row}, column: ${this.currentTile.column} not found.`);
        }
    }

    // Method to set a new current tile for the weapon
    setCurrentTile(newTile) {
        this.currentTile = newTile;
        this.addWeaponToTile();
    }

    // Getter for the weapon's name
    getWeaponName() {
        return this.name;
    }

    // Getter for the current tile
    getCurrentTile() {
        return this.currentTile;
    }
}

export default Weapon;

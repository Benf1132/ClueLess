import Hand from './Hand.js';
import Hallway from './Hallway.js';

class Player {
    constructor(username = '', password = '', character = null) {
        this.username = username;
        this.password = password;
        this.character = character;
        this.hand = new Hand();
        this.activePlayer = true;
        this.pulledBySuggestion = false;
    }

    // Getter for the username
    getUsername() {
        return this.username;
    }

    // Getter for the password
    getPassword() {
        return this.password;
    }

    // Check if the player is active
    isActive() {
        return this.activePlayer;
    }

    // Set the player as inactive and update hallway occupancy
    setInactivity() {
        this.activePlayer = false;

        const currentTile = this.character.getCurrentTile();
        if (currentTile instanceof Hallway) {
            currentTile.setOccupied(false);
        }
    }

    // Check if the player was pulled by a suggestion
    wasPulledBySuggestion() {
        return this.pulledBySuggestion;
    }

    // Set if the player was pulled by a suggestion
    setPulledBySuggestion(pulledBySuggestion) {
        this.pulledBySuggestion = pulledBySuggestion;
    }

    // Getter for the character
    getCharacter() {
        return this.character;
    }

    // Getter for the player's hand
    getHand() {
        return this.hand;
    }
    // Enhanced getMatchingCards method with debug logs
    getMatchingCards(suspect, weapon, room) {
        return this.hand.getCards().filter(card => {
            // Retrieve the actual names for comparison
            const suspectName = CharacterName[suspect]?.name;
            const weaponName = WeaponName[weapon]?.name;
            const roomName = RoomName[room]?.name;

            const matchesSuspect = card.getName() === suspectName;
            const matchesWeapon = card.getName() === weaponName;
            const matchesRoom = card.getName() === roomName;
        });
    }

    // Set the player's username
    setUsername(username) {
        this.username = username;
    }

    // Set the player's password
    setPassword(password) {
        this.password = password;
    }

    // Set the player's character
    setCharacter(character) {
        this.character = character;
    }
}

export default Player;

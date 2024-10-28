import Hand from './Hand.js';
import Hallway from './Hallway.js';
import { CharacterName, WeaponName, RoomName, getEnumName } from './GameEnums.js';

class Player {
    constructor(username = '', password = '', character = null) {
        this.username = username;
        this.password = password;
        this.character = character;
        this.hand = new Hand();
        this.activePlayer = true;
        this.pulledBySuggestion = false;
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }

    isActive() {
        return this.activePlayer;
    }

    setInactivity() {
        this.activePlayer = false;

        const currentTile = this.character.getCurrentTile();
        if (currentTile instanceof Hallway) {
            currentTile.setOccupied(false);
        }
    }

    wasPulledBySuggestion() {
        return this.pulledBySuggestion;
    }

    setPulledBySuggestion(pulledBySuggestion) {
        this.pulledBySuggestion = pulledBySuggestion;
    }

    getCharacter() {
        return this.character;
    }

    getHand() {
        return this.hand;
    }

    getMatchingCards(suspect, weapon, room) {
        return this.hand.getCards().filter(card => {
            return (
                card.getName() === suspect ||
                card.getName() === weapon ||
                card.getName() === room
            );
        });
    }

    setUsername(username) {
        this.username = username;
    }

    setPassword(password) {
        this.password = password;
    }

    setCharacter(character) {
        this.character = character;
    }
}

export default Player;

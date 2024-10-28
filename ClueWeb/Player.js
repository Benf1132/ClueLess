import Hand from './Hand.js';
import Hallway from './Hallway.js';
import { CharacterName, WeaponName, RoomName } from './GameEnums.js';

function getEnumName(enumType, key) {
    return enumType[key]?.name || key;
}

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

    // Enhanced getMatchingCards method with standardized enum names
    getMatchingCards(suspect, weapon, room) {
        const suspectName = getEnumName(CharacterName, suspect);
        const weaponName = getEnumName(WeaponName, weapon);
        const roomName = getEnumName(RoomName, room);

        return this.hand.getCards().filter(card => {
            const matchesSuspect = card.getName() === suspectName;
            const matchesWeapon = card.getName() === weaponName;
            const matchesRoom = card.getName() === roomName;

            console.log(`Checking card ${card.getName()} against suspect: ${matchesSuspect}, weapon: ${matchesWeapon}, room: ${matchesRoom}`);
            return matchesSuspect || matchesWeapon || matchesRoom;
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

import { Suggestion } from './Suggestion.js';

class Accusation extends Suggestion {
    constructor(playerList, room, weapon, suspect, envelope) {
        super(playerList, room, weapon, suspect);
        this.envelope = envelope;
        this.isAccusationCorrect = this.checkAccusation();
    }

    // Check if the suspect, weapon, and room match the envelope
    checkAccusation() {
        const suspectMatches = this.envelope.getSuspectCard().getName() === this.suspect;
        const weaponMatches = this.envelope.getWeaponCard().getName() === this.weapon;
        const roomMatches = this.envelope.getRoomCard().getName() === this.room;

        return suspectMatches && weaponMatches && roomMatches;
    }

    // Method to determine if the accusation is correct
    isAccusationValid() {  // Changed the method name to avoid confusion with the property
        return this.isAccusationCorrect;
    }
}

export { Accusation };

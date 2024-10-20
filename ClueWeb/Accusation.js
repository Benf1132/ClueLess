class Accusation extends Suggestion {
    constructor(playerList, room, weapon, suspect, envelope) {
        super(playerList, room, weapon, suspect);
        this.envelope = envelope;
        this.isAccusationCorrect = this.checkAccusation();
    }

    // Check if the suspect, weapon, and room match the envelope
    checkAccusation() {
        const suspectMatches = this.envelope.getSuspectCard().getName() === this.suspect.getCharacterName();
        const weaponMatches = this.envelope.getWeaponCard().getName() === this.weapon.getWeaponName();
        const roomMatches = this.envelope.getRoomCard().getName() === this.room.getRoomName();

        return suspectMatches && weaponMatches && roomMatches;
    }

    // Method to determine if the accusation is correct
    isAccusationCorrect() {
        return this.isAccusationCorrect;
    }
}

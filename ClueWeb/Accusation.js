class Accusation extends Suggestion {
    constructor(playerList, room, weapon, suspect, envelope) {
        super(playerList, room, weapon, suspect);
        this.envelope = envelope;
        this.isAccusationCorrect = this.checkAccusation();
    }

    // Check if the suspect, weapon, and room match the envelope (using object comparison)
    checkAccusation() {
        const suspectMatches = this.envelope.getSuspectCard() === this.suspect.getCharacter();
        const weaponMatches = this.envelope.getWeaponCard() === this.weapon;
        const roomMatches = this.envelope.getRoomCard() === this.room;

        return suspectMatches && weaponMatches && roomMatches;
    }

    isAccusationValid() {
        return this.isAccusationCorrect;
    }
}

export { Accusation };

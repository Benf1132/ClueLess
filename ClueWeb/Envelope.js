import { CardType } from './GameEnums.js';
import Hand from './Hand.js';

class Envelope {
    constructor(suspect, weapon, room) {
        this.envelopeHand = new Hand();
        this.envelopeHand.addCard(suspect);
        this.envelopeHand.addCard(weapon);
        this.envelopeHand.addCard(room);
    }

    getSuspectCard() {
        return this.envelopeHand.getCardByType(CardType.SUSPECT);
    }

    getWeaponCard() {
        return this.envelopeHand.getCardByType(CardType.WEAPON);
    }

    getRoomCard() {
        return this.envelopeHand.getCardByType(CardType.ROOM);
    }
}

export default Envelope;

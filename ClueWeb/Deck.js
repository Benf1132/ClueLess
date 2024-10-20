import { CardType, CharacterName, WeaponName, RoomName } from './GameEnums.js';
import Card from './Card.js';
import Envelope from './Envelope.js';

class Deck {
    constructor() {
        this.deck = [];
        this.topCardIndex = 0;
        this.deckMaker();
    }

    deckMaker() {
        // Suspects
        Object.keys(CharacterName).forEach(suspect => {
            this.deck.push(new Card(CardType.SUSPECT, suspect));
        });

        // Weapons
        Object.keys(WeaponName).forEach(weapon => {
            this.deck.push(new Card(CardType.WEAPON, weapon));
        });

        // Rooms
        Object.keys(RoomName).forEach(room => {
            this.deck.push(new Card(CardType.ROOM, room));
        });

        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    envelopeCardPicker() {
        const suspectCard = this.deck.find(card => card.getType() === CardType.SUSPECT);
        const weaponCard = this.deck.find(card => card.getType() === CardType.WEAPON);
        const roomCard = this.deck.find(card => card.getType() === CardType.ROOM);

        this.deck = this.deck.filter(card => card !== suspectCard && card !== weaponCard && card !== roomCard);

        return new Envelope(suspectCard, weaponCard, roomCard);
    }

    dealCards(players) {
        let playerIndex = 0;
        while (this.topCardIndex < this.deck.length) {
            const dealtCard = this.deck[this.topCardIndex++];
            players[playerIndex].getHand().addCard(dealtCard);
            playerIndex = (playerIndex + 1) % players.length;
        }
    }

    getCardByName(name) {
        return this.deck.find(card => card.getName().toLowerCase() === name.toLowerCase()) || null;
    }

    getDeck() {
        return [...this.deck];
    }
}

export default Deck;

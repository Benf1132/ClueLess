class Hand {
    constructor() {
        this.cards = [];
    }

    addCards(newCards) {
        this.cards.push(...newCards);
    }

    addCard(newCard) {
        this.cards.push(newCard);
    }

    getCard(index) {
        if (index >= 0 && index < this.cards.length) {
            return this.cards[index];
        } else {
            throw new Error(`Invalid card index: ${index}`);
        }
    }
    
    getCardByType(type) {
        return this.cards.find(card => card.type === type);
    }

    getCards() {
        return this.cards;
    }

    hasCard(card) {
        return this.cards.includes(card);
    }

    clear() {
        this.cards = [];
    }
}

export default Hand;

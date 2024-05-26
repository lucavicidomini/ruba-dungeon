import { Card, Suits } from "./card.model";

export class Deck {

    static suits: Set<Suits> = new Set(['clubs', 'cups', 'coins', 'swords']);

    private constructor(
        private deckCards: Card[] = [],
    ) {}

    static empty(): Deck {
        return new Deck();
    }

    static full(): Deck {
        const cards: Card[] = [];
        Deck.suits.forEach(
            suit => Array.from(Array(10).keys()).forEach(
                value => cards.push(new Card(value + 1, suit))
            )
        );
        return new Deck(cards);
    }

    clone(): Deck {
        return new Deck([...this.deckCards]);
    }

    includes(card: Card) {
        return !!this.cards.find(inDeck => inDeck.equals(card));
    }

    extractCharacterDeck(): Deck {
        const characters = new Deck(this.deckCards.filter(card => card.value >= 8));
        this.deckCards = this.deckCards.filter(card => card.value < 8);
        return characters;
    }

    extractRelicDeck(): Deck {
        const relics = new Deck(this.deckCards.filter(card => card.value === 1));
        this.deckCards = this.deckCards.filter(card => card.value > 1);
        return relics;
    }

    filterBySuit(suit: Suits): Deck {
        return new Deck(this.cards.filter(card => card.suit === suit));
    }

    peek(): Card | undefined {
        return this.deckCards[this.deckCards.length - 1];
    }

    pop(): Card | undefined {
        return this.deckCards.pop();
    }

    popPlayerCard() {
        const rndValue = Math.floor(Math.random() * 2 + 8);
        const rndSuit = Array.from(Deck.suits)[Math.floor(Math.random() * Deck.suits.size)];
        const i = this.deckCards.findIndex(card => card.suit === rndSuit && card.value == rndValue);
        return this.deckCards.splice(i, 1)[0];
    }

    push(card: Card): void {
        this.deckCards.push(card);
    }

    pushAll(other: Deck): void {
        other.cards.forEach(otherCard => this.push(otherCard));
    }

    remove(card: Card): void {
        this.deckCards = this.deckCards.filter(inDeck => !inDeck.equals(card));
    }

    removeAll(other: Deck): void {
        other.cards.forEach(otherCard => this.remove(otherCard));
    }

    reverse(): void {
        this.deckCards.reverse();
    }

    shuffle() {
        this.deckCards.sort(
            () => Math.random() - .5
        );
    }

    get cards(): Card[] {
        return this.deckCards;
    }

    get length(): number {
        return this.deckCards.length;
    }

    get value(): number {
        return this.deckCards.reduce(
            (accValue, card) => accValue += card.value,
            0
        );
    }

}

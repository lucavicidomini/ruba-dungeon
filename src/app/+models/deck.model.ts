import { Card, Suits } from "./card.model";

export class Deck {

    static suits: Set<Suits> = new Set(['clubs', 'cups', 'coins', 'swords']);

    private constructor(
        private cards: Card[] = [],
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

    extractCharacterDeck(): Deck {
        const characters = new Deck(this.cards.filter(card => card.value >= 8));
        this.cards = this.cards.filter(card => card.value < 8);
        return characters;
    }

    extractRelicDeck(): Deck {
        const relics = new Deck(this.cards.filter(card => card.value === 1));
        this.cards = this.cards.filter(card => card.value > 1);
        return relics;
    }

    pop(): Card | undefined {
        return this.cards.pop();
    }

    popPlayerCard() {
        const rndValue = Math.floor(Math.random() * 2 + 8);
        const rndSuit = Array.from(Deck.suits)[Math.floor(Math.random() * Deck.suits.size)];
        const i = this.cards.findIndex(card => card.suit === rndSuit && card.value == rndValue);
        return this.cards.splice(i, 1)[0];
    }

    push(card: Card): void {
        this.cards.push(card);
    }

    shuffle() {
        this.cards.sort(
            () => Math.random() - .5
        );
    }

    get length(): number {
        return this.cards.length;
    }

    get value(): number {
        return this.cards.reduce(
            (accValue, card) => accValue += card.value,
            0
        );
    }

}
export type Suits = 'clubs' | 'cups' | 'coins' | 'swords';

export class Card {

    constructor(
        private cardValue: number,
        private cardSuit: Suits,
    ) {}

    equals(other: Card) {
        return this.cardSuit === other.cardSuit && this.cardValue === other.cardValue;
    }

    get suit() {
        return this.cardSuit;
    }

    get value() {
        return this.cardValue;
    }

}
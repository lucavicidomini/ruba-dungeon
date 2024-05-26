export type Suits = 'clubs' | 'cups' | 'coins' | 'swords';

export const SuitLabels: Record<Suits, string> = {
    'clubs': 'Clubs',
    'coins': 'Coins',
    'cups': 'Cups',
    'swords' : 'Swords',
}

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
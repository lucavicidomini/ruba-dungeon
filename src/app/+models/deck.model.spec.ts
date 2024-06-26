import { Card, Suits } from "./card.model";
import { Deck } from "./deck.model";

describe ('Deck', () => {

    const DECK_LENGTH_FULL = 40;
    const DECK_LENGTH_EMPTY = 0;
    const SUITS_COUNT = 4;
    const VALUES_SUM = 55; // 1 + 2 + ... + VALUES_COUNT
    const CHARACTERS_COUNT = 12;
    const PLAYER_VALUE_MIN = 8;
    const PLAYER_VALUE_MAX = 9;
    const RELIC_VALUE = 1;

    describe('full()', () => {

        it('Should return a full deck of cards', () => {
            const deck = Deck.full();
            expect(deck.length).toEqual(DECK_LENGTH_FULL);
            expect(deck.value).toEqual(VALUES_SUM * SUITS_COUNT);
        });

    });

    describe('empty()', () => {

        it('Should return an empty deck of cards', () => {
            const deck = Deck.empty();
            expect(deck.length).toEqual(DECK_LENGTH_EMPTY);
            expect(deck.value).toEqual(DECK_LENGTH_EMPTY);
        });

    });

    describe('When deck is empty', () => {

        it('pop() should return undefined', () => {
            const deck = Deck.empty();
            const actualCard = deck.pop();
            expect(actualCard).toBeUndefined();
        });

        it('peek() should return undefined', () => {
            const deck = Deck.empty();
            const actualCard = deck.peek();
            expect(actualCard).toBeUndefined();
        });

    });

    describe('When deck is not empty', () => {

        it('Should find only included cards', () => {
            const deck = Deck.empty();
            deck.push(new Card(1, 'clubs'));
            deck.push(new Card(2, 'coins'));
            deck.push(new Card(3, 'cups'));
            expect(deck.includes(new Card(1, 'clubs'))).toBeTrue();
            expect(deck.includes(new Card(2, 'coins'))).toBeTrue();
            expect(deck.includes(new Card(3, 'cups'))).toBeTrue();
            expect(deck.includes(new Card(4, 'swords'))).toBeFalse();
        });

        it('Should pop the last pushed card', () => {
            const deck = Deck.empty();
            const expectedCard = new Card(5, 'coins');
            deck.push(new Card(1, 'clubs'));
            deck.push(expectedCard);
            const actualCard = deck.pop();
            expect(actualCard).toEqual(expectedCard);
        });

        it('Should remove a card if included', () => {
            const deck = Deck.empty();
            deck.push(new Card(1, 'clubs'));
            deck.push(new Card(2, 'coins'));
            deck.push(new Card(3, 'cups'));
            deck.remove(new Card(2, 'coins'));
            expect(deck.includes(new Card(1, 'clubs'))).toBeTrue();
            expect(deck.includes(new Card(2, 'coins'))).toBeFalse();
            expect(deck.includes(new Card(3, 'cups'))).toBeTrue();
        });

        it('Should not change deck if removing a card not included', () => {
            const deck = Deck.empty();
            deck.push(new Card(1, 'clubs'));
            deck.push(new Card(2, 'coins'));
            deck.push(new Card(3, 'cups'));
            deck.remove(new Card(4, 'swords'));
            expect(deck.includes(new Card(1, 'clubs'))).toBeTrue();
            expect(deck.includes(new Card(2, 'coins'))).toBeTrue();
            expect(deck.includes(new Card(3, 'cups'))).toBeTrue();
            expect(deck.length).toEqual(3);
        });

        it('Should peek the last pushed card', () => {
            const deck = Deck.empty();
            const expectedCard = new Card(5, 'coins');
            deck.push(new Card(1, 'clubs'));
            deck.push(expectedCard);
            const actualCard = deck.peek();
            expect(actualCard).toEqual(expectedCard);
        });

        it('Should pop a player card a card with value 8 or 9', () => {
            const deck = Deck.full();
            const playerCard = deck.popPlayerCard();
            expect(playerCard).toBeDefined();
            expect(playerCard.value).toBeGreaterThanOrEqual(PLAYER_VALUE_MIN);
            expect(playerCard.value).toBeLessThanOrEqual(PLAYER_VALUE_MAX);
            expect(deck.length).toEqual(DECK_LENGTH_FULL - 1);
        });

        it('Should extract all card in deck with value 8 or 9', () => {
            const deck = Deck.full();
            deck.popPlayerCard();
            const extractedDeck = deck.extractCharacterDeck();
            expect(extractedDeck.length).toEqual(CHARACTERS_COUNT - 1);
            expect(deck.length).toBe(DECK_LENGTH_FULL - CHARACTERS_COUNT)
        });

        it('Should extract all card in deck with value 1', () => {
            const deck = Deck.full();
            const extractedDeck = deck.extractRelicDeck();
            expect(extractedDeck.length).toEqual(SUITS_COUNT);
            expect(extractedDeck.value).toEqual(RELIC_VALUE * SUITS_COUNT);
            expect(deck.length).toBe(DECK_LENGTH_FULL - SUITS_COUNT)
        });

    });

});
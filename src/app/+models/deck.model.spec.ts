import { Card } from "./card.model";
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

    describe('pop() and push()', () => {

        it('Should pop() the last push()\'ed card', () => {
            const deck = Deck.empty();
            const expectedCard = new Card(5, 'coins');
            deck.push(new Card(1, 'clubs'));
            deck.push(expectedCard);
            const actualCard = deck.pop();
            expect(actualCard).toEqual(expectedCard);
        });

        describe('When deck is empty', () => {

            it('Should pop() undefined', () => {
                const deck = Deck.empty();
                const actualCard = deck.pop();
                expect(actualCard).toBeUndefined();
            });

        });

    });

    describe('popPlayerCard()', () => {

        it('Should pop() a card with value 8 or 9', () => {
            const deck = Deck.full();
            const playerCard = deck.popPlayerCard();
            expect(playerCard).toBeDefined();
            expect(playerCard.value).toBeGreaterThanOrEqual(PLAYER_VALUE_MIN);
            expect(playerCard.value).toBeLessThanOrEqual(PLAYER_VALUE_MAX);
            expect(deck.length).toEqual(DECK_LENGTH_FULL - 1);
        });

    });

    describe('extractCharacterDeck()', () => {

        it('Should extract all card in deck with value 8 or 9', () => {
            const deck = Deck.full();
            deck.popPlayerCard();
            const extractedDeck = deck.extractCharacterDeck();
            expect(extractedDeck.length).toEqual(CHARACTERS_COUNT - 1);
            expect(deck.length).toBe(DECK_LENGTH_FULL - CHARACTERS_COUNT)
        });

    });

    describe('extractRelicDeck()', () => {

        it('Should extract all card in deck with value 1', () => {
            const deck = Deck.full();
            const extractedDeck = deck.extractRelicDeck();
            expect(extractedDeck.length).toEqual(SUITS_COUNT);
            expect(extractedDeck.value).toEqual(RELIC_VALUE * SUITS_COUNT);
            expect(deck.length).toBe(DECK_LENGTH_FULL - SUITS_COUNT)
        });

    });

});
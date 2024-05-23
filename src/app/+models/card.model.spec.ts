import { Card } from "./card.model";

describe ('Card', () => {

    const DECK_LENGTH_FULL = 40;
    const DECK_LENGTH_EMPTY = 0;
    const SUITS_COUNT = 4;
    const VALUES_SUM = 55; // 1 + 2 + ... + VALUES_COUNT
    const CHARACTERS_COUNT = 12;
    const PLAYER_VALUE_MIN = 8;
    const PLAYER_VALUE_MAX = 9;
    const RELIC_VALUE = 1;

    describe('equals()', () => {

        it('Should return true if two card have same value and suit', () => {
            const a = new Card(1, 'clubs');
            const b = new Card(1, 'clubs');
            expect(a.equals(b)).toBeTrue();
        });

        it('Should return false if two card have different values', () => {
            const a = new Card(1, 'clubs');
            const b = new Card(2, 'clubs');
            expect(a.equals(b)).toBeFalse();
        });

        it('Should return false if two card have different suits', () => {
            const a = new Card(1, 'clubs');
            const b = new Card(1, 'coins');
            expect(a.equals(b)).toBeFalse();
        });

    });

});
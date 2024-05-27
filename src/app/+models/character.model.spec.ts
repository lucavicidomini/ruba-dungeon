import { Card } from "./card.model";
import { Character } from "./character.model";

describe('Character', () => {

    describe('updateHp', () => {

        let character: Character;

        beforeEach(() => {
            character = new Character(new Card(8, 'clubs'), 6, 12);
        });

        it('Should add HPs', () => {
            character = character.updateHp(3);
            expect(character.hp).toEqual(9);
        });

        it('Should subtract HPs', () => {
            character = character.updateHp(-3);
            expect(character.hp).toEqual(3);
        });

    });

});
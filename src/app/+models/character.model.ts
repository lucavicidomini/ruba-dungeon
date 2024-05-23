import { Card } from "./card.model";

export class Character {

    static HP_MIN = 0;
    static HP_MAX = 12;

    constructor(
        private characterCard: Card,
        private characterHp: number,
    ) {}

    updateHp(deltaHp: number) {
        const hp = Math.max(Character.HP_MIN, Math.min(Character.HP_MAX, this.characterHp + deltaHp));
        return new Character(this.characterCard, hp);
    }

    get card(): Card {
        return this.characterCard;
    }

    get hp(): number {
        return this.characterHp;
    }

}
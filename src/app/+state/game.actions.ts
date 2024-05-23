import { createAction, props } from '@ngrx/store';
import { Deck } from '../+models/deck.model';
import { Card } from '../+models/card.model';

export const start = createAction('[Game] Start');

export const setup = createAction(
    '[Game] Setup',
    props<{
        dungeon: Deck,
        character: Deck,
        relic: Deck,
        event: Deck,
        gold: Deck,
        aid: Deck,
        heroHp: number,
        heroCard: Card;
    }>()
);

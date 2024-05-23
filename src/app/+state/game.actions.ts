import { createAction, props } from '@ngrx/store';
import { Deck } from '../+models/deck.model';
import { Card } from '../+models/card.model';
import { Character } from '../+models/character.model';

export const start = createAction('[Game] Start');

export const setup = createAction(
    '[Game] Setup',
    props<{
        aid: Deck,
        catacomb: Deck,
        character: Deck,
        dungeon: Deck,
        event: Deck,
        gold: Deck,
        relic: Deck,
        obtainedRelic: Deck,
        hero: Character,
    }>()
);
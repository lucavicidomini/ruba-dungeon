import { createAction, props } from '@ngrx/store';
import { Deck } from '../+models/deck.model';
import { Character } from '../+models/character.model';

export const collect = createAction('[Game] Collect');

export const collected = createAction('[Game] Collected',
    props<{ event: Deck, gold: Deck }>()
);

export const draw = createAction('[Game] Draw');

export const drawn = createAction('[Game] Uncover',
    props<{ event: Deck, dungeon: Deck }>()
);

export const error = createAction('[Game] Error',
    props<{ error: any }>()
);

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

export const start = createAction('[Game] Start');

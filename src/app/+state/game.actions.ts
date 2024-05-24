import { createAction, props } from '@ngrx/store';
import { Deck } from '../+models/deck.model';
import { Character } from '../+models/character.model';
import { DeckState, PartialDeckState } from './game.reducer';

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

export const goldSelected = createAction('[Game] Gold Selected',
    props<{ goldSelected: Deck }>()
);

export const resolveCard = createAction('[Game] Resolve Card');

export const resolvedCard = createAction(
    '[Game] Resolved Card',
    props<{ hpDelta: number }>()
);

export const resolveCardSuccess = createAction('[Game] Resolve Success');

export const resolveCardFailure = createAction('[Game] Resolve Failure');

export const setup = createAction(
    '[Game] Setup',
    props<{ decks: PartialDeckState, hero: Character }>()
);

export const start = createAction('[Game] Start');

export const throwDice = createAction('[Game] Throw Dice');

export const threwDice = createAction(
    '[Game] Threw Dice',
    props<{ dice: number }>()
);


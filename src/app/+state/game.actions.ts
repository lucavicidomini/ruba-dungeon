import { createAction, props } from '@ngrx/store';
import { Character } from '../+models/character.model';
import { PartialDeckState } from './game.reducer';

export * from './combat.actions';
export * from './crawl.actions';
export * from './ui.actions';

/** Unexpected error in the game */
export const error = createAction(
    '[Game] Error',
    props<{ error: any }>()
);

/** Hero lost all of his HP */
export const gameOver = createAction(
    '[Game] Game Over'
);

/** Player won the game */
export const gameWon = createAction(
    '[Game] Game Won'
);

/** Starts a new game */
export const start = createAction(
    '[Game] Start'
);

/** New game started */
export const started = createAction(
    '[Game] Started',
    props<{ decks: PartialDeckState, hero: Character }>()
);

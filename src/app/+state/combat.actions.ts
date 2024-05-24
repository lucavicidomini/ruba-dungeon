import { createAction, props } from '@ngrx/store';
import { Character } from '../+models/character.model';
import { Deck } from '../+models/deck.model';

/**
 * Update state after a clash with action cards; check if hero or enemy were defeated; check if turn is completed.
 * Dispatched after `actionPlay`
 * */
export const actionPlayed = createAction(
    '[Game/Combat] Action Played',
    props<{ enemy: Character, enemyAction: Deck, event: Deck, hero: Character, heroAction: Deck }>()
);

/** Starts a new action phase of a combat turn */
export const actionStart = createAction(
    '[Game/Combat] Action Start'
);

/** Increase action counter in state. Dispatched after `actionStart`. */
export const actionStarted = createAction(
    '[Game/Combat] Action Started',
    props<{ action: number }>()
);

/**
 * Dipatched after:
 * - `revealedOk` if revealed enemy is a king
 * - `challenged` if user choses to combat an enemy
 */
export const combatStart = createAction(
    '[Game/Combat] Combat Start'
);

/** Dispatched after `combatStart */
export const combatStarted = createAction(
    '[Game/Combat] Combat Started',
);

/**
 * Starts a new turn and creates action decks for hero and enemy. Dispatched in two cases:
 * - after `combatStarted` when a new combat begins
 * - after `fighted` when there are no more enemy cards
 */
export const turnStart = createAction(
    '[Game/Combat] Turn Start'
);

/** Update state. Dispatched after `turnStart`. */
export const turnStarted = createAction(
    '[Game/Combat] Turn Started',
    props<{ dungeon: Deck, event: Deck, heroAction: Deck, enemyAction: Deck }>()
);

/**
 * Add enemy to aid deck and clear action cards. 
 * Dispatched after:
 * - `revealedOk` if revealed enemy is not a king
 * . `actionPlayed` if enemy was defeated and hero lived
 */
export const resolveCombat = createAction(
    '[Game/Combat] Resolve Combat'
);

/** Updated state after `resolveCombat` */
export const resolvedCombat = createAction(
    '[Game/Combat] Resolved Combat',
    props<{ aid: Deck, event: Deck, heroAction: Deck, obtainedRelic: Deck, relic: Deck }>()
);
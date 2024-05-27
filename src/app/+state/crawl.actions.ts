import { createAction, props } from '@ngrx/store';
import { Card } from '../+models/card.model';
import { Character } from '../+models/character.model';
import { Deck } from '../+models/deck.model';

/** Dispatched after `challenge` */
export const challenged = createAction(
    '[Game/Crawl] Challenged',
    props<{ character: Deck, enemy: Character }>()
);

/** Dispatched after `collect` */
export const collected = createAction(
    '[Game/Crawl] Collected',
    props<{ event: Deck, gold: Deck }>()
);

/** Dispatched after `draw` */
export const drawn = createAction(
    '[Game/Crawl] Drawn',
    props<{ dungeon: Deck, event: Deck }>()
);

/** Dispatched after `spent` if event card is swords and selected gold is > event card value  */
export const reveal = createAction(
    '[Game/Crawl] Reveal'
);

/** Dispatched after `bribe` */
export const revealed = createAction(
    '[Game] Revealed',
    props<{ character: Deck, enemy: Character }>()
);

/** Dispatched after `spend` */
export const spent = createAction(
    '[Game/Crawl] Spent',
    props<{ eventCard: Card, event: Deck, gold: Deck, selectedGoldValue: number }>()
);

/** Dispatched aftert `throwDice` */
export const threwDice = createAction(
    '[Game/Crawl] Threw Dice',
    props<{ dice: number }>()
);

/**
 * Dispatched in three cases
 * - after `spent` if event card is clubs or cups
 * - after `spent` if event card is swords and selected gold == event card value
 * - after `resolveCard` if dice test was successfull
 */
export const resolveCardSuccess = createAction(
    '[Game/Crawl] Resolve Card Success',
    props<{ eventCard: Card }>()
);

/** Calculate status effect of clubs and cups, but does not apply them. Dispatched after `resolveCard` if dice test was failed */
export const resolveCardFailure = createAction(
    '[Game/Crawl] Resolve Card Failure',
    props<{ eventCard: Card }>()
);

/** Apply status effect of clubs and cups. Dispatched after `resolveCardSuccess` or `resolveCardFailure`. */
export const resolvedCard = createAction(
    '[Game/Crawl] Resolved Card',
    props<{ hpDelta: number }>()
);

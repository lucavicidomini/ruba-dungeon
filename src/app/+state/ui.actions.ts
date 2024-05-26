import { createAction, props } from '@ngrx/store';
import { Deck } from '../+models/deck.model';
import { Suits } from '../+models/card.model';

/** Player has selected one or more action cards (if available) and clicks the Play button */
export const actionPlay = createAction(
    '[Game/UI] Action Play',
    props<{ suit?: Suits, action: Deck }>()
);

/** Event card is Swords and player clicks the Combat button */
export const challenge = createAction(
    '[Game/UI] Challenge'
);

/** Event card is Coins and player clicks the Collect button */
export const collect = createAction(
    '[Game/UI] Collect'
);

/** Player clicks the Draw button */
export const draw = createAction(
    '[Game/UI] Draw'
);

/** An Event card is shown and player clicks the Dice button */
export const throwDice = createAction(
    '[Game/UI] Throw Dice'
);

/** The dice was thrown and player acknowledges the outcome by clicking Ok */
export const resolveCardByDice = createAction(
    '[Game/UI] Resolve Card By Dice'
);

/** Player selected a card from the gold deck */
export const goldSelected = createAction(
    '[Game/UI] Gold Selected',
    props<{ goldSelected: Deck }>()
);

/** Bribe was successfull and player acknowledges the bribed enemy by clicking Ok */
export const revealedOk = createAction(
    '[Game/UI] Revealed Ok'
);

/** Player choses to skip/bribe a cart by using gold */
export const spend = createAction(
    '[Game/UI] Spend'
);
import { createAction, props } from '@ngrx/store';
import { Character } from '../+models/character.model';
import { Deck } from '../+models/deck.model';
import { PartialDeckState } from './game.reducer';
import { Card } from '../+models/card.model';

export const bribe = createAction(
    '[Game] Bribe'
);

export const combat = createAction(
    '[Game] Combat'
);

export const combatAction = createAction(
    '[Game] Combat Action'
);

export const challenge = createAction(
    '[Game] Challenge'
);

export const challenged = createAction(
    '[Game] Challenged',
    props<{ character: Deck, enemy: Character }>()
);

export const combatStarted = createAction(
    '[Game] Combat Started',
    props<{ heroAction: Deck, enemyAction: Deck }>()
);

export const collected = createAction(
    '[Game] Collected',
    props<{ event: Deck, gold: Deck }>()
);

export const collect = createAction(
    '[Game] Collect'
);

export const draw = createAction(
    '[Game] Draw'
);

export const drawn = createAction(
    '[Game] Uncover',
    props<{ event: Deck, dungeon: Deck }>()
);

export const error = createAction(
    '[Game] Error',
    props<{ error: any }>()
);

export const fight = createAction(
    '[Game] Fight'
);

export const fighted = createAction(
    '[Game] Fighted',
    props<{ enemy: Character, enemyAction: Deck, hero: Character, heroAction: Deck }>()
);

export const goldSelected = createAction(
    '[Game] Gold Selected',
    props<{ goldSelected: Deck }>()
);

export const heroActionSelected = createAction(
    '[Game] Hero Action Selected',
    props<{ heroActionSelected: Deck }>()
);

export const resolveCard = createAction(
    '[Game] Resolve Card'
);

export const resolvedCard = createAction(
    '[Game] Resolved Card',
    props<{ hpDelta: number }>()
);

export const resolveCardSuccess = createAction(
    '[Game] Resolve Success'
);

export const resolveCardFailure = createAction(
    '[Game] Resolve Failure'
);

export const resolveCombat = createAction(
    '[Game] Resolve Combat'
);

export const resolvedCombat = createAction(
    '[Game] Resolved Combat',
    props<{ aid: Deck }>()
);

export const revealed = createAction(
    '[Game] Revealed',
    props<{ character: Deck, enemy: Character }>()
);

export const revealedOk = createAction(
    '[Game] Revealed Ok'
);

export const setup = createAction(
    '[Game] Setup',
    props<{ decks: PartialDeckState, hero: Character }>()
);

export const spend = createAction(
    '[Game] Spend'
);

export const spent = createAction(
    '[Game] Spent',
    props<{ eventCard: Card, event: Deck, gold: Deck, selectedGoldValue: number }>()
);

export const start = createAction(
    '[Game] Start'
);

export const throwDice = createAction(
    '[Game] Throw Dice'
);

export const threwDice = createAction(
    '[Game] Threw Dice',
    props<{ dice: number }>()
);

export const turnStart = createAction(
    '[Game] Turn Start',
    props<{ action: number }>()
);


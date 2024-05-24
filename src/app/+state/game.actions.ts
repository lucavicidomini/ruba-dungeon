import { createAction, props } from '@ngrx/store';
import { Character } from '../+models/character.model';
import { Deck } from '../+models/deck.model';
import { PartialDeckState } from './game.reducer';
import { Card } from '../+models/card.model';

export const actionStart = createAction(
    '[Game] Action Start'
);

export const actionStarted = createAction(
    '[Game] Action Started',
    props<{ action: number }>()
);

export const bribe = createAction(
    '[Game] Bribe'
);

export const challenge = createAction(
    '[Game] Challenge'
);

export const challenged = createAction(
    '[Game] Challenged',
    props<{ character: Deck, enemy: Character }>()
);

export const combatStart = createAction(
    '[Game] Combat Start'
);

export const combatStarted = createAction(
    '[Game] Combat Started',
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
    props<{ dungeon: Deck, event: Deck }>()
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
    props<{ enemy: Character, enemyAction: Deck, event: Deck, hero: Character, heroAction: Deck }>()
);

export const gameOver = createAction(
    '[Game] Game Over'
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
    props<{ aid: Deck, event: Deck }>()
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
    '[Game] Turn Start'
);

export const turnStarted = createAction(
    '[Game] Turn Started',
    props<{ dungeon: Deck, event: Deck, heroAction: Deck, enemyAction: Deck }>()
);


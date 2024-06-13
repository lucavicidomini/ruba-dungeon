import { createReducer, on } from '@ngrx/store';
import { Character } from '../+models/character.model';
import { Deck } from '../+models/deck.model';
import { GameStatus } from '../+models/game.model';
import * as GameActions from './game.actions';
import * as TutorialActions from './tutorial.actions';
import { Card } from '../+models/card.model';
import { TutorialStep } from '../+models/tutorial.model';

export const GAME_STATE_KEY = 'game';

interface CombatState {
  action: number;
  aidSelected: Deck,
  heroAction: Deck,
  heroActionSelected: Deck,
  enemyAction: Deck,
}

export interface PartialDeckState {
  aid?: Deck;
  catacomb?: Deck;
  character: Deck;
  dungeon: Deck;
  event?: Deck;
  gold?: Deck;
  goldSelected?: Deck;
  obtainedRelic?: Deck;
  relic: Deck;
}

export interface DeckState extends Required<PartialDeckState> {}

export interface GameState {
  combat: CombatState,
  decks: DeckState,
  dice?: number,
  enemy?: Character,
  error: any;
  eventCard?: Card,
  hero?: Character,
  status: GameStatus;

  tutorialIndex?: number;
  tutorialStep?: TutorialStep;
}

export const initialCombatState = {
  action: 0,
  aidSelected: Deck.empty(),
  heroAction: Deck.empty(),
  heroActionSelected: Deck.empty(),
  enemyAction: Deck.empty(),
}

export const initialState: GameState = {
  combat: initialCombatState,
  decks: {
    aid: Deck.empty(),
    catacomb: Deck.empty(),
    character: Deck.empty(),
    dungeon: Deck.empty(),
    event: Deck.empty(),
    gold: Deck.empty(),
    goldSelected: Deck.empty(),
    obtainedRelic: Deck.empty(),
    relic: Deck.empty(),
  },
  enemy: undefined,
  error: undefined,
  eventCard: undefined,
  hero: undefined,
  status: GameStatus.GAME_INIT,

  tutorialIndex: undefined,
};

export const gameReducer = createReducer(
  initialState,

  on(GameActions.reset, () => initialState),

  on(GameActions.aidSelected, (state, { aidSelected }) => ({
    ...state,
    combat: {
      ...state.combat,
      aidSelected,
    },
    decks: {
      ...state.decks,
    },
  })),

  on(GameActions.actionStarted, (state, { action }) => ({
    ...state,
    combat: {
      ...state.combat,
      action,
    }
  })),

  on(GameActions.challenged, (state, { character, enemy }) => ({
    ...state,
    decks: {
      ...state.decks,
      character,
    },
    enemy,
  })),

  on(GameActions.collected, (state, { event, gold }) => ({
    ...state,
    decks: {
      ...state.decks,
      event,
      gold,
    },
    eventCard: undefined,
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.combatStart, (state) => ({
    ...state,
    status: GameStatus.COMBAT,
  })),

  on(GameActions.actionStart, (state, { }) => ({
    ...state,
    status: GameStatus.COMBAT,
  })),

  on(GameActions.combatStarted, (state) => ({
    ...state,
    combat: {
      ...state.combat,
      action: 0,
    },
    decks: {
      ...state.decks,
    },
  })),

  on(GameActions.discardAction, (state) => ({
    ...state,
    status: GameStatus.DISCARD_ACTION,
  })),

  on(GameActions.drawn, (state, { event, dungeon }) => ({
    ...state,
    decks: {
      ...state.decks,
      event,
      dungeon,
    },
    eventCard: event.peek(),
    status: GameStatus.CRAWL_ACT,
  })),

  on(GameActions.error, (state, { error }) => ({
    ...state,
    error,
  })),

  on(GameActions.actionPlayed, (state, { aid, catacomb, enemy, enemyAction, event, hero, heroAction }) => ({
    ...state,
    combat: {
      ...state.combat,
      aidSelected: Deck.empty(),
      enemyAction,
      heroAction,
      heroActionSelected: Deck.empty(),
    },
    decks: {
      ...state.decks,
      aid,
      catacomb,
      event,
    },
    enemy,
    hero,
  })),

  on(GameActions.gameOver, (state) => ({
    ...state,
    status: GameStatus.GAME_OVER,
  })),

  on(GameActions.gameWon, (state) => ({
    ...state,
    status: GameStatus.GAME_WON,
  })),

  on(GameActions.goldSelected, (state, { goldSelected }) => ({
    ...state,
    decks: {
      ...state.decks,
      goldSelected,
    },
  })),

  on(GameActions.heroActionSelected, (state, { heroActionSelected }) => ({
    ...state,
    combat: {
      ...state.combat,
      heroActionSelected,
    },
  })),

  on(GameActions.keptSelectedAction, (state, { heroAction, event }) => ({
    ...state,
    combat: {
      ...state.combat,
      heroAction,
      heroActionSelected: Deck.empty(),
    },
    decks: {
      ...state.decks,
      event,
    },
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.resolvedCard, (state, { hpDelta }) => ({
    ...state,
    eventCard: undefined,
    hero: state.hero?.updateHp(hpDelta),
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.resolvedCombat, (state, { aid, event, heroAction, obtainedRelic, relic }) => ({
    ...state,
    combat: {
      ...state.combat,
      enemyAction: Deck.empty(),
      heroAction,
      heroActionSelected: Deck.empty(),
    },
    decks: {
      ...state.decks,
      aid,
      event,
      obtainedRelic,
      relic,
    },
    enemy: undefined,
    eventCard: undefined,
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.revealed, (state, { character, enemy }) => ({
    ...state,
    decks: {
      ...state.decks,
      character,
    },
    enemy,
    status: GameStatus.ENEMY_REVEALED,
  })),

  on(GameActions.skipped, (state) => ({
    ...state,
    eventCard: undefined,
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.started, (state, { decks, hero }) => ({
    ...state,
    combat: initialCombatState,
    decks: {
      aid: Deck.empty(),
      catacomb: Deck.empty(),
      event: Deck.empty(),
      gold: Deck.empty(),
      goldSelected: Deck.empty(),
      obtainedRelic: Deck.empty(),
      ...decks,
    },
    enemy: undefined,
    eventCard: undefined,
    hero,
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.spent, (state, { event, gold }) => ({
    ...state,
    decks: {
      ...state.decks,
      event,
      gold,
      goldSelected: Deck.empty(),
    },
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.threwDice, (state, { dice }) => ({
    ...state,
    dice,
    status: GameStatus.RESOLVE_THREW_DICE,
  })),

  on(GameActions.turnStarted, (state, { dungeon, event, heroAction, enemyAction }) => ({
    ...state,
    combat: {
      ...state.combat,
      action: 0,
      heroAction,
      enemyAction,
    },
    decks: {
      ...state.decks,
      dungeon,
      event,
    }
  })),

  on(TutorialActions.next, (state) => ({
    ...state,
    tutorialIndex: (state.tutorialIndex ?? 0) + 1,
  })),

  on(TutorialActions.nextReady, (state, { step }) => ({
    ...state,
    tutorialStep: step,
  })),

  on(TutorialActions.start, (state) => ({
    ...state,
    tutorialIndex: 0,
  })),

  on(TutorialActions.exit, (state) => ({
    ...state,
    tutorialIndex: undefined,
  })),

);

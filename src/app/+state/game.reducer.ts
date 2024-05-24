import { createReducer, on } from '@ngrx/store';
import { Character } from '../+models/character.model';
import { Deck } from '../+models/deck.model';
import { GameStatus } from '../+models/game.model';
import * as GameActions from './game.actions';

export const GAME_STATE_KEY = 'game';

interface CombatState {
  action: number;
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
  hero?: Character,
  status: GameStatus;
}

export const initialCombatState = {
  action: 0,
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
  hero: undefined,
  status: GameStatus.GAME_INIT,
};

export const gameReducer = createReducer(
  initialState,

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
      action: 0,
      heroAction: Deck.empty(),
      heroActionSelected: Deck.empty(),
      enemyAction: Deck.empty(),
    },
    decks: {
      ...state.decks,
    },
  })),

  on(GameActions.drawn, (state, { event, dungeon }) => ({
    ...state,
    decks: {
      ...state.decks,
      event,
      dungeon,
    },
    status: GameStatus.CRAWL_ACT,
  })),

  on(GameActions.error, (state, { error }) => ({
    ...state,
    error,
  })),

  on(GameActions.actionPlayed, (state, { enemy, enemyAction, event, hero, heroAction }) => ({
    ...state,
    combat: {
      ...state.combat,
      enemyAction,
      heroAction,
      heroActionSelected: Deck.empty(),
    },
    decks: {
      ...state.decks,
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

  on(GameActions.resolvedCard, (state, { hpDelta }) => ({
    ...state,
    hero: state.hero?.updateHp(hpDelta),
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.resolvedCard, (state, { hpDelta }) => ({
    ...state,
    hero: state.hero?.updateHp(hpDelta),
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.resolvedCombat, (state, { aid, event, obtainedRelic, relic }) => ({
    ...state,
    combat: initialCombatState,
    decks: {
      ...state.decks,
      aid,
      event,
      obtainedRelic,
      relic,
    },
    enemy: undefined,
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

  on(GameActions.started, (state, { decks, hero }) => ({
    ...state,
    decks: {
      aid: Deck.empty(),
      catacomb: Deck.empty(),
      event: Deck.empty(),
      gold: Deck.empty(),
      goldSelected: Deck.empty(),
      obtainedRelic: Deck.empty(),
      ...decks,
    },
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

);

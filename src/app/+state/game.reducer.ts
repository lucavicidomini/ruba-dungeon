import { createReducer, on } from '@ngrx/store';
import * as GameActions from './game.actions';
import { Deck } from '../+models/deck.model';
import { GameStatus } from '../+models/game.model';
import { Character } from '../+models/character.model';
import { Card } from '../+models/card.model';

export const GAME_STATE_KEY = 'game';

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
  decks: DeckState;
  dice?: number,
  enemy?: Character,
  error: any;
  hero?: Character,
  status: GameStatus;
}

export const initialState: GameState = {
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

  on(GameActions.collected, (state, { event, gold }) => ({
    ...state,
    decks: {
      ...state.decks,
      event,
      gold,
    },
    status: GameStatus.CRAWL_READY,
  })),

  on(GameActions.combat, (state) => ({
    ...state,
    status: GameStatus.COMBAT,
  })),

  // on(GameActions.combatStart, (state, { character, enemy }) => ({
  //   ...state,
  //   decks: {
  //     ...state.decks,
  //     character,
  //   },
  //   enemy,
  //   status: GameStatus.COMBAT,
  // })),

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

  on(GameActions.goldSelected, (state, { goldSelected }) => ({
    ...state,
    decks: {
      ...state.decks,
      goldSelected,
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

  on(GameActions.resolvedCombat, (state, { aid }) => ({
    ...state,
    decks: {
      ...state.decks,
      aid,
    },
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

  on(GameActions.setup, (state, { decks, hero }) => ({
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

  on(GameActions.threwDice, (state, { dice }) => ({
    ...state,
    dice,
    status: GameStatus.RESOLVE_THREW_DICE,
  })),

);
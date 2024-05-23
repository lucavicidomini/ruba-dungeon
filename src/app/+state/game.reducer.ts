import { Action, createReducer, on } from '@ngrx/store';
import * as ScoreboardPageActions from './game.actions';
import { Deck } from '../+models/deck.model';
import { Card } from '../+models/card.model';
import { GameStatus } from '../+models/game.model';
import { Character } from '../+models/character.model';

export const GAME_STATE_KEY = 'game';

export interface GameState {
  decks: {
    aid: Deck;
    catacomb: Deck;
    character: Deck;
    dungeon: Deck;
    event: Deck;
    gold: Deck;
    obtainedRelic: Deck;
    relic: Deck;
  };
  enemy?: Character,
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
    obtainedRelic: Deck.empty(),
    relic: Deck.empty(),
  },
  enemy: undefined,
  hero: undefined,
  status: GameStatus.GAME_INIT,
};

export const gameReducer = createReducer(
  initialState,

  on(ScoreboardPageActions.setup, (state, { aid, catacomb, character, dungeon, event, gold, relic, obtainedRelic, hero }) => ({
    ...state,
    decks: {
      aid,
      catacomb,
      character,
      dungeon,
      event,
      gold,
      relic,
      obtainedRelic,
    },
    hero,
  })),

);
import { Action, createReducer, on } from '@ngrx/store';
import * as ScoreboardPageActions from './game.actions';
import { Deck } from '../+models/deck.model';
import { Card } from '../+models/card.model';
import { GameStatus } from '../+models/game.model';

export const GAME_STATE_KEY = 'game';

export interface GameState {
  decks: {
    aid: Deck;
    catacomb: Deck;
    character: Deck;
    dungeon: Deck;
    event: Deck;
    gold: Deck;
    relic: Deck;
  };
  hero: {
    hp: number;
    card?: Card;
  }
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
    relic: Deck.empty(),
  },
  hero: {
    hp: 0,
  },
  status: GameStatus.GAME_INIT,
};

export const gameReducer = createReducer(
  initialState,

  on(ScoreboardPageActions.setup, (state, { aid, catacomb, character, dungeon, event, gold, relic, heroHp, heroCard }) => ({
    ...state,
    decks: {
      aid,
      catacomb,
      character,
      dungeon,
      event,
      gold,
      relic,
    },
    hero: {
      hp: heroHp,
      card: heroCard
    }
  })),

);
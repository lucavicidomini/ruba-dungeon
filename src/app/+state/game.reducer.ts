import { Action, createReducer, on } from '@ngrx/store';
import * as ScoreboardPageActions from './game.actions';
import { Deck } from '../+models/deck.model';
import { Card } from '../+models/card.model';
import { GameStatus } from '../+models/game.model';

export const GAME_STATE_KEY = 'game';

export interface GameState {
  decks: {
    dungeon: Deck;
    character: Deck;
    relic: Deck;
    event: Deck;
    gold: Deck;
    aid: Deck;
  };
  hero: {
    hp: number;
    card?: Card;
  }
  status: GameStatus;
}

export const initialState: GameState = {
  decks: {
    dungeon: Deck.empty(),
    character: Deck.empty(),
    relic: Deck.empty(),
    event: Deck.empty(),
    gold: Deck.empty(),
    aid: Deck.empty(),
  },
  hero: {
    hp: 0,
  },
  status: GameStatus.GAME_INIT,
};

export const gameReducer = createReducer(
  initialState,

  on(ScoreboardPageActions.setup, (state, { dungeon, character, relic, event, gold, aid, heroHp, heroCard }) => ({
    ...state,
    decks: {
      dungeon,
      character,
      relic,
      event,
      gold,
      aid,
    },
    hero: {
      hp: heroHp,
      card: heroCard
    }
  })),

);
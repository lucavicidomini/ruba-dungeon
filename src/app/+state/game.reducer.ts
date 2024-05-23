import { Action, createReducer, on } from '@ngrx/store';
import * as ScoreboardPageActions from './game.actions';
import { Deck } from '../+models/deck.model';
import { Card } from '../+models/card.model';

export interface State {
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
}

export const initialState: State = {
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
  }
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
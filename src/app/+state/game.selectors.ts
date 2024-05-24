import { createSelector } from '@ngrx/store';
import { GAME_STATE_KEY, GameState } from './game.reducer';
import { AppState } from './app.reducer';

const selectFeature = (state: AppState) => state[GAME_STATE_KEY];

export const selectAidDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.aid
);

export const selectCatacombDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.catacomb
);

export const selectCharacterDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.character
);

export const selectDice = createSelector(
  selectFeature,
  (state: GameState) => state.dice
);

export const selectDungeonDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.dungeon
);

export const selectEnemy = createSelector(
  selectFeature,
  (state: GameState) => state.enemy
);

export const selectGoldDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.gold
);

export const selectGoldSelectedDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.goldSelected
);

export const selectEventCard = createSelector(
  selectFeature,
  (state: GameState) => state.decks.event.peek()
);

export const selectEventDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.event
);

export const selectHero = createSelector(
  selectFeature,
  (state: GameState) => state.hero
);

export const selectRelicDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.relic
);

export const selectObtainedRelicDeck = createSelector(
  selectFeature,
  (state: GameState) => state.decks.obtainedRelic
);

export const selectStatus = createSelector(
  selectFeature,
  (state: GameState) => state.status
);

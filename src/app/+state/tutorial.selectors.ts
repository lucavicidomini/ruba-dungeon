import { createSelector } from '@ngrx/store';
import { GAME_STATE_KEY, GameState } from './game.reducer';
import { AppState } from './app.reducer';

const selectFeature = (state: AppState) => state[GAME_STATE_KEY];

export const selectIndex = createSelector(
  selectFeature,
  (state: GameState) => state.tutorialIndex
);

export const selectStep = createSelector(
  selectFeature,
  (state: GameState) => state.tutorialStep
);
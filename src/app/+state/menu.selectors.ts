import { createSelector } from '@ngrx/store';
import { AppState } from './app.reducer';
import { MENU_STATE_KEY, MenuState } from './menu.reducer';

const selectFeature = (state: AppState) => state[MENU_STATE_KEY];

export const selectAbout = createSelector(
  selectFeature,
  (state: MenuState) => state.about
);

export const selectNewGame = createSelector(
  selectFeature,
  (state: MenuState) => state.newGame
);

export const selectSettings = createSelector(
  selectFeature,
  (state: MenuState) => state.settings
);
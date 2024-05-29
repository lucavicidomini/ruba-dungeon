import { createSelector } from '@ngrx/store';
import { AppState } from './app.reducer';
import { MENU_STATE_KEY, MenuState } from './menu.reducer';

const selectFeature = (state: AppState) => state[MENU_STATE_KEY];

export const selectAbout = createSelector(
  selectFeature,
  (state: MenuState) => state.showAbout
);

export const selectNewGame = createSelector(
  selectFeature,
  (state: MenuState) => state.showNewGame
);

export const selectSettings = createSelector(
  selectFeature,
  (state: MenuState) => state.showSettings
);

export const selectLayout = createSelector(
  selectFeature,
  (state: MenuState) => state.layout
)
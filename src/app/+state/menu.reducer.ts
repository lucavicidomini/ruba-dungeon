import { createReducer, on } from '@ngrx/store';
import * as MenuActions from './menu.actions';

export const MENU_STATE_KEY = 'menu';

export interface MenuState {
  about: boolean;
  newGame: boolean;
  settings: boolean;
}

export const initialState: MenuState = {
  about: false,
  newGame: false,
  settings: false,
};

export const menuReducer = createReducer(
  initialState,

  on(MenuActions.openAbout, (state) => ({
    ...state,
    about: true,
  })),

  on(MenuActions.openNewGame, (state) => ({
    ...state,
    newGame: true,
  })),

  on(MenuActions.openSettings, (state) => ({
    ...state,
    settings: true,
  })),

);

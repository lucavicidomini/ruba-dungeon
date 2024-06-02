import { createReducer, on } from '@ngrx/store';
import * as MenuActions from './menu.actions';
import { LayoutSetting } from '../+models/settings.model';

export const MENU_STATE_KEY = 'menu';

export interface MenuState {
  showAbout: boolean;
  showNewGame: boolean;
  showSettings: boolean;
  layout: LayoutSetting;
}

export const initialState: MenuState = {
  showAbout: true,
  showNewGame: false,
  showSettings: false,
  layout: 'classic',
};

export const menuReducer = createReducer(
  initialState,

  on(MenuActions.openAbout, (state, { show }) => ({
    ...state,
    showAbout: show === undefined ? !state.showAbout : show,
  })),

  on(MenuActions.openNewGame, (state, { show }) => ({
    ...state,
    showNewGame: show === undefined ? !state.showNewGame : show,
  })),

  on(MenuActions.openSettings, (state, { show }) => ({
    ...state,
    showSettings: show === undefined ? !state.showSettings : show,
  })),

  on(MenuActions.setLayout, (state, { layout }) => ({
    ...state,
    layout,
  }))

);

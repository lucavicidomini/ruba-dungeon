import { GAME_STATE_KEY, GameState } from './game.reducer';
import { MENU_STATE_KEY, MenuState } from './menu.reducer';

export interface AppState {
  [GAME_STATE_KEY]: GameState,
  [MENU_STATE_KEY]: MenuState,
}

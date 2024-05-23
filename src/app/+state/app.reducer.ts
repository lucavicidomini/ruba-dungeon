import { GAME_STATE_KEY, GameState } from './game.reducer';

export interface AppState {
  [GAME_STATE_KEY]: GameState,
}

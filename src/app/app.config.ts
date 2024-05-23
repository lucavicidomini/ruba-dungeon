import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { GAME_STATE_KEY, gameReducer } from './+state/game.reducer';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(),
    // provideState({ name: GAME_STATE_KEY, reducer: gameReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ]
};

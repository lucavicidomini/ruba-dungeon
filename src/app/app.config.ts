import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { gameReducer } from './+state/game.reducer';
import { GameFacade } from './+state/game.facade';
import { GamesEffects } from './+state/game.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(),
    provideState({ name: 'game', reducer: gameReducer }),
    provideEffects(GamesEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    GameFacade,
  ]
};

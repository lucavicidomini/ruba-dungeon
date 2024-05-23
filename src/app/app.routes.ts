import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { GamesEffects } from './+state/game.effects';
import { GameFacade } from './+state/game.facade';
import { GameComponent } from './game/game.component';
import { provideState } from '@ngrx/store';
import { GAME_STATE_KEY, gameReducer } from './+state/game.reducer';

export const routes: Routes = [
    {
        path: 'game',
        component: GameComponent,
        providers: [
            // provideState({ name: [GAME_STATE_KEY], reducer: gameReducer }),
            provideEffects(GamesEffects),
            GameFacade,
        ],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'game'
    },
];

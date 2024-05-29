import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { GamesEffects } from './+state/game.effects';
import { GameFacade } from './+state/game.facade';
import { GAME_STATE_KEY, gameReducer } from './+state/game.reducer';
import { MenuFacade } from './+state/menu.facade';
import { MENU_STATE_KEY, menuReducer } from './+state/menu.reducer';
import { GameComponent } from './game/game.component';
import { LoggerService } from './logger.service';

export const routes: Routes = [
    {
        path: 'game',
        component: GameComponent,
        providers: [
            provideState({ name: GAME_STATE_KEY, reducer: gameReducer }),
            provideState({ name: MENU_STATE_KEY, reducer: menuReducer }),
            provideEffects(GamesEffects),
            GameFacade,
            LoggerService,
            MenuFacade,
        ],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'game'
    },
];

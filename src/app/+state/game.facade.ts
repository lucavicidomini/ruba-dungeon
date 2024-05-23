import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as GameActions from './game.actions';

@Injectable()
export class GameFacade {

    private store = inject(Store);

    start() {
        this.store.dispatch(GameActions.start());
    }

}
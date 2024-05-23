import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';

@Injectable()
export class GameFacade {

    private store = inject(Store);

    dungeonDeck$ = this.store.select(GameSelectors.selectDungeonDeck);

    status$ = this.store.select(GameSelectors.selectStatus);

    start() {
        this.store.dispatch(GameActions.start());
    }

}
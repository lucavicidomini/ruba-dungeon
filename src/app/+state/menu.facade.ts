import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as MenuActions from './menu.actions';
// import * as MenuSelectors from './menu.selectors';

@Injectable()
export class MenuFacade {

    private store = inject(Store);

    about() {
        this.store.dispatch(MenuActions.openAbout());
    }

    newGame() {
        this.store.dispatch(MenuActions.openNewGame());
    }

    settings() {
        this.store.dispatch(MenuActions.openSettings());
    }

}
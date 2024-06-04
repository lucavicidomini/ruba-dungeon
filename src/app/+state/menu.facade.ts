import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as MenuActions from './menu.actions';
import * as MenuSelectors from './menu.selectors';
import { LayoutSetting } from "../+models/settings.model";

@Injectable()
export class MenuFacade {

    private store = inject(Store);

    about$ = this.store.select(MenuSelectors.selectAbout);

    newGame$ = this.store.select(MenuSelectors.selectNewGame);

    layout$ = this.store.select(MenuSelectors.selectLayout);

    settings$ = this.store.select(MenuSelectors.selectSettings);

    about(show?: boolean) {
        this.store.dispatch(MenuActions.openAbout({ show }));
    }

    newGame(show?: boolean) {
        this.store.dispatch(MenuActions.openNewGame({ show }));
    }

    settings(show?: boolean) {
        this.store.dispatch(MenuActions.openSettings({ show }));
    }
    
    setLayout(layout: LayoutSetting) {
        this.store.dispatch(MenuActions.setLayout({ layout }));
    }
}
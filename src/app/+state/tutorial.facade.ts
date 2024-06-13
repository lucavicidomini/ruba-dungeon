import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as TutorialActions from './tutorial.actions';
import * as TutorialSelectors from './tutorial.selectors';

@Injectable()
export class TutorialFacade {

    private store = inject(Store);

    index$ = this.store.select(TutorialSelectors.selectIndex);

    step$ = this.store.select(TutorialSelectors.selectStep);
    
    tutorialNext() {
        this.store.dispatch(TutorialActions.next());
    }

    tutorialStart() {
        this.store.dispatch(TutorialActions.start());
    }

    tutorialExit() {
        this.store.dispatch(TutorialActions.exit());
    }

}
import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';

@Injectable()
export class GameFacade {

    private store = inject(Store);

    aidDeck$ = this.store.select(GameSelectors.selectAidDeck);

    enemy$ = this.store.select(GameSelectors.selectEnemy);

    eventCard$ = this.store.select(GameSelectors.selectEventCard);

    catacombDeck$ = this.store.select(GameSelectors.selectCatacombDeck);

    characterDeck$ = this.store.select(GameSelectors.selectCharacterDeck);

    dungeonDeck$ = this.store.select(GameSelectors.selectDungeonDeck);

    goldDeck$ = this.store.select(GameSelectors.selectGoldDeck);

    hero$ = this.store.select(GameSelectors.selectHero);

    relicDeck$ = this.store.select(GameSelectors.selectRelicDeck);

    obtainedRelicDeck$ = this.store.select(GameSelectors.selectObtainedRelicDeck);

    status$ = this.store.select(GameSelectors.selectStatus);

    /** If the event card is coins, collect it */
    collect() {
        this.store.dispatch(GameActions.collect());
    }

    /** Draw a card from dungeon deck */
    draw() {
        this.store.dispatch(GameActions.draw());
    }

    /** Starts a new game */
    start() {
        this.store.dispatch(GameActions.start());
    }

}
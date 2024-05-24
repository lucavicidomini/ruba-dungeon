import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';
import { Deck } from "../+models/deck.model";

@Injectable()
export class GameFacade {

    private store = inject(Store);

    aidDeck$ = this.store.select(GameSelectors.selectAidDeck);

    catacombDeck$ = this.store.select(GameSelectors.selectCatacombDeck);

    characterDeck$ = this.store.select(GameSelectors.selectCharacterDeck);
    
    dice$ = this.store.select(GameSelectors.selectDice);

    dungeonDeck$ = this.store.select(GameSelectors.selectDungeonDeck);
    
    enemy$ = this.store.select(GameSelectors.selectEnemy);

    eventCard$ = this.store.select(GameSelectors.selectEventCard);

    goldDeck$ = this.store.select(GameSelectors.selectGoldDeck);

    selectGoldSelectedDeck$ = this.store.select(GameSelectors.selectGoldSelectedDeck);

    hero$ = this.store.select(GameSelectors.selectHero);

    obtainedRelicDeck$ = this.store.select(GameSelectors.selectObtainedRelicDeck);

    relicDeck$ = this.store.select(GameSelectors.selectRelicDeck);

    status$ = this.store.select(GameSelectors.selectStatus);

    /** If the event card is coins, collect it */
    collect() {
        this.store.dispatch(GameActions.collect());
    }

    /** Draw a card from dungeon deck */
    draw() {
        this.store.dispatch(GameActions.draw());
    }

    /** User selected/deselected a gold card */
    goldSelected(goldSelected: Deck) {
        this.store.dispatch(GameActions.goldSelected({ goldSelected }));
    }

    resolveDice() {
        this.store.dispatch(GameActions.resolveCard());
    }

    /** Starts a new game */
    start() {
        this.store.dispatch(GameActions.start());
    }

    throwDice() {
        this.store.dispatch(GameActions.throwDice())
    }

}
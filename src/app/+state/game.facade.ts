import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';
import { Deck } from "../+models/deck.model";
import { Suits } from "../+models/card.model";

@Injectable()
export class GameFacade {

    private store = inject(Store);

    aidDeck$ = this.store.select(GameSelectors.selectAidDeck);

    catacombDeck$ = this.store.select(GameSelectors.selectCatacombDeck);

    characterDeck$ = this.store.select(GameSelectors.selectCharacterDeck);

    combatAction$ = this.store.select(GameSelectors.selectCombatAction);
    
    dice$ = this.store.select(GameSelectors.selectDice);

    dungeonDeck$ = this.store.select(GameSelectors.selectDungeonDeck);

    enemy$ = this.store.select(GameSelectors.selectEnemy);

    enemyAction$ = this.store.select(GameSelectors.selectEnemyActions);

    eventCard$ = this.store.select(GameSelectors.selectEventCard);
    
    eventDeck$ = this.store.select(GameSelectors.selectEventDeck);

    error$ = this.store.select(GameSelectors.selectError);

    goldDeck$ = this.store.select(GameSelectors.selectGoldDeck);

    hero$ = this.store.select(GameSelectors.selectHero);

    heroAction$ = this.store.select(GameSelectors.selectHeroAction);

    heroActionSelectedDeck$ = this.store.select(GameSelectors.selectHeroActionSelected);

    selectGoldSelectedDeck$ = this.store.select(GameSelectors.selectGoldSelectedDeck);

    obtainedRelicDeck$ = this.store.select(GameSelectors.selectObtainedRelicDeck);

    relicDeck$ = this.store.select(GameSelectors.selectRelicDeck);

    status$ = this.store.select(GameSelectors.selectStatus);

    /** Event card was swords and player choose to combat */
    challenge() {
        this.store.dispatch(GameActions.challenge());
    }

    /** If the event card is coins, collect it */
    collect() {
        this.store.dispatch(GameActions.collect());
    }

    /** Reveal an enemy  */
    combatStart() {
        this.store.dispatch(GameActions.combatStart());
    }

    /** Draw a card from dungeon deck */
    draw() {
        this.store.dispatch(GameActions.draw());
    }

    /** User selected one ot more card to combat */
    fight(suit?: Suits) {
        this.store.dispatch(GameActions.actionPlay({ suit }));
    }

    /** User selected/deselected a gold card */
    goldSelected(goldSelected: Deck) {
        this.store.dispatch(GameActions.goldSelected({ goldSelected }));
    }

    /** User selected/deselected an action card */
    heroActionSelected(heroActionSelected: Deck) {
        this.store.dispatch(GameActions.heroActionSelected({ heroActionSelected }));
    }

    resolveCardByDice() {
        this.store.dispatch(GameActions.resolveCardByDice());
    }

    revealedOk() {
        this.store.dispatch(GameActions.revealedOk())
    }

    /** User choose to spend coins to resolve an event card */
    spend() {
        this.store.dispatch(GameActions.spend());
    }

    /** Starts a new game */
    start() {
        this.store.dispatch(GameActions.start());
    }

    throwDice() {
        this.store.dispatch(GameActions.throwDice())
    }

}
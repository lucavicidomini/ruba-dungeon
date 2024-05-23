import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';

@Injectable()
export class GameFacade {

    private store = inject(Store);

    aidDeck$ = this.store.select(GameSelectors.selectAidDeck);

    enemyCard$ = this.store.select(GameSelectors.selectEnemyCard);

    eventCard$ = this.store.select(GameSelectors.selectEventCard);

    catacombDeck$ = this.store.select(GameSelectors.selectCatacombDeck);

    characterDeck$ = this.store.select(GameSelectors.selectCharacterDeck);

    dungeonDeck$ = this.store.select(GameSelectors.selectDungeonDeck);

    goldDeck$ = this.store.select(GameSelectors.selectGoldDeck);

    heroCard$ = this.store.select(GameSelectors.selectHeroCard);

    relicDeck$ = this.store.select(GameSelectors.selectRelicDeck);

    obtainedRelicDeck$ = this.store.select(GameSelectors.selectObtainedRelicDeck);

    status$ = this.store.select(GameSelectors.selectStatus);

    start() {
        this.store.dispatch(GameActions.start());
    }

}
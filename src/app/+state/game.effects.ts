import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';
import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';
import { Deck } from '../+models/deck.model';
import { Character } from '../+models/character.model';
import { Store } from '@ngrx/store';
import { AppState } from './app.reducer';

@Injectable()
export class GamesEffects {

  collect$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.collect),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectGoldDeck),
    ),
    map(([, eventIm, goldIm]) => {
      const event = eventIm.clone();
      const gold = goldIm.clone();
      const eventCard = event.pop();
      if (!eventCard) {
        return GameActions.error({ error: 'No event card' });
      }
      if (eventCard.suit !== 'coins') {
        return GameActions.error({ error: `Event card is ${eventCard.suit} while coins where expected` });
      }
      gold.push(eventCard);
      return GameActions.collected({ event, gold });
    })
  ));

  drawn$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.draw),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectDungeonDeck),
    ),
    map(([, eventIm, dungeonIm]) => {
      const event = eventIm.clone();
      const dungeon = dungeonIm.clone();
      const dungeonCard = dungeon.pop();
      if (!dungeonCard) {
        return GameActions.error({ error: 'Dungeon deck is empty' });
      }
      event.push(dungeonCard);
      return GameActions.drawn({ event, dungeon });
    })
  ));

  start$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.start),
    map(() => {
        const dungeon = Deck.full();
        const hero = new Character(dungeon.popPlayerCard(), 12);
        const character = dungeon.extractCharacterDeck();
        const relic = dungeon.extractRelicDeck();
        const aid = Deck.empty();
        const catacomb = Deck.empty();
        const event = Deck.empty();
        const gold = Deck.empty();
        const obtainedRelic = Deck.empty();
        dungeon.shuffle();
        return GameActions.setup({ aid, catacomb, dungeon, character, event, gold, relic, obtainedRelic, hero });
    })
  ));

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) {}
}
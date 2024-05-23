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

  draw$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.draw),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectDungeonDeck),
    ),
    map(([, event, dungeon]) => {
      console.log('draw')
      const eventCard = dungeon.pop();
      if (eventCard) {
        event.push(eventCard);
      }

      return GameActions.uncover({ event, dungeon });
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
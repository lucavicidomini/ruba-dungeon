import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';
import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';
import { Deck } from '../+models/deck.model';
import { Character } from '../+models/character.model';
import { Store } from '@ngrx/store';
import { AppState } from './app.reducer';
import { DeckState } from './game.reducer';

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

  draw$ = createEffect(() => this.actions$.pipe(
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

  resolveCard$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCard),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventCard),
      this.store.select(GameSelectors.selectDice),
    ),
    map(([, eventCard, dice]) => {
      if (dice === 1) {
        return GameActions.resolveCardFailure()
      }

      if (dice === 6) {
        return GameActions.resolveCardSuccess();
      }

      const eventCardValue = eventCard?.value;

      if (!dice || !eventCardValue) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.resolveCard.type}: dice=${dice}, eventCardValue=${eventCardValue}` });
      }

      if (dice >= eventCardValue) {
        return GameActions.resolveCardSuccess();
      }

      return GameActions.resolveCardFailure();
    }),
  ));

  resolveCardFailure$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCardFailure),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventCard),
    ),
    map(([, eventCard]) => {
      const eventCardSuit = eventCard?.suit;
      let hpDelta = 0;

      if (eventCardSuit === 'clubs' || eventCardSuit == 'cups') {
        hpDelta = -Math.floor((eventCard?.value ?? 0) / 2);
      }

      return GameActions.resolvedCard({ hpDelta });
    })
  ));

  resolveCardSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCardSuccess),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventCard),
    ),
    map(([, eventCard]) => {
      const eventCardSuit = eventCard?.suit;
      let hpDelta = 0;

      if (eventCardSuit === 'cups') {
        hpDelta = eventCard?.value ?? 0;
      }

      return GameActions.resolvedCard({ hpDelta });
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
        const goldSelected = Deck.empty();
        const obtainedRelic = Deck.empty();
        dungeon.shuffle();
        const decks: DeckState = { aid, catacomb, dungeon, character, event, gold, goldSelected, relic, obtainedRelic }
        return GameActions.setup({ decks, hero });
    })
  ));

  throwDice$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.throwDice),
    map(() => {
      const dice = Math.floor(Math.random() * 6 + 1);
      return GameActions.threwDice({ dice });
    })
  ));

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) {}
}
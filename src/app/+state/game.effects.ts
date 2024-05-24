import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';
import * as GameActions from './game.actions';
import * as GameSelectors from './game.selectors';
import { Deck } from '../+models/deck.model';
import { Character } from '../+models/character.model';
import { Store } from '@ngrx/store';
import { AppState } from './app.reducer';
import { DeckState, PartialDeckState } from './game.reducer';
import { Card } from '../+models/card.model';

@Injectable()
export class GamesEffects {

  bribe$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.bribe),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventCard),
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectGoldDeck),
      this.store.select(GameSelectors.selectGoldSelectedDeck),
    ),
    map(([, eventCard, eventIm, goldIm, selectedGold]) => {
      if (!eventCard) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.bribe.type}: eventCard=${eventCard}` });
      }

      const selectedGoldValue = selectedGold.value;

      // Gold cards are placed on top of event card
      const event = eventIm.clone();
      const gold = goldIm.clone();
      selectedGold.cards.forEach(card => {
        gold.remove(card);
        event.push(card);
      });

      return GameActions.bribed({ eventCard, event, gold, selectedGoldValue });
    }),
  ));

  bribed$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.bribed),
    // withLatestFrom(
    //   this.store.select(GameSelectors.selectEventCard),
    // ),
    map(({ eventCard, event: eventIm, gold: goldIm, selectedGoldValue }) => {
      const eventCardSuit = eventCard.suit;

      if (eventCardSuit === 'clubs' || eventCardSuit === 'cups') {
        return GameActions.resolveCardSuccess();
      }
      
      const eventCardValue = eventCard.value;

      if (eventCardSuit === 'swords' && eventCardValue !== undefined && eventCardValue === selectedGoldValue) {
        return GameActions.resolveCardSuccess();
      }

      if (eventCardSuit === 'swords' && eventCardValue !== undefined && eventCardValue > selectedGoldValue) {
        
      }

      return GameActions.error({ error: `Invalid state for action ${GameActions.bribe.type}: eventCardSuit=${eventCardSuit}, selectedGoldValue=${selectedGoldValue}` });
    }),
  ));

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
    }),
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
    }),
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
    }),
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
    }),
  ));

  // start$ = createEffect(() => this.actions$.pipe(
  //   ofType(GameActions.start),
  //   map(() => {
  //       const dungeon = Deck.full();
  //       const hero = new Character(dungeon.popPlayerCard(), 12);
  //       const character = dungeon.extractCharacterDeck();
  //       const relic = dungeon.extractRelicDeck();
  //       dungeon.shuffle();
  //       const decks: PartialDeckState = { dungeon, character, relic };
  //       return GameActions.setup({ decks, hero });
  //   }),
  // ));

  startDebug$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.start),
    map(() => {
      const hero = new Character(new Card(8, 'swords'), 12);

      const character = Deck.empty();
      character.push(new Card(8, 'clubs'));
      character.push(new Card(9, 'clubs'));
      character.push(new Card(10, 'clubs'));
      character.push(new Card(8, 'coins'));
      character.push(new Card(9, 'coins'));
      character.push(new Card(10, 'coins'));
      character.push(new Card(8, 'cups'));
      character.push(new Card(9, 'cups'));
      character.push(new Card(10, 'cups'));
      character.push(new Card(9, 'swords'));
      character.push(new Card(10, 'swords'));

      const relic = Deck.empty();
      character.push(new Card(1, 'clubs'));
      character.push(new Card(1, 'coins'));
      character.push(new Card(1, 'cups'));
      character.push(new Card(1, 'swords'));

      const dungeon = Deck.empty();
      dungeon.push(new Card(4, 'coins'));
      dungeon.push(new Card(5, 'coins'));
      dungeon.push(new Card(4, 'clubs'));
      dungeon.push(new Card(5, 'clubs'));
      dungeon.push(new Card(4, 'cups'));
      dungeon.push(new Card(5, 'cups'));
      dungeon.reverse();
      
      const decks: PartialDeckState = { dungeon, character, relic };
      return GameActions.setup({ decks, hero });
    }),
  ));

  throwDice$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.throwDice),
    map(() => {
      const dice = Math.floor(Math.random() * 6 + 1);
      return GameActions.threwDice({ dice });
    }),
  ));

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) {}
}
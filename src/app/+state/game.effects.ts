import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { Card } from '../+models/card.model';
import { Character } from '../+models/character.model';
import { Deck } from '../+models/deck.model';
import { AppState } from './app.reducer';
import * as GameActions from './game.actions';
import { PartialDeckState } from './game.reducer';
import * as GameSelectors from './game.selectors';

@Injectable()
export class GamesEffects {

  bribe$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.bribe),
    withLatestFrom(
      this.store.select(GameSelectors.selectCharacterDeck),
    ),
    map(([, characterIm]) => {
      const character = characterIm.clone();

      // Reveal the enemy
      const enemyCard = character.pop();

      if (!enemyCard) {
        return GameActions.error({ error: `No enemy found` });  
      }

      // In easy mode enemies always enter Combat with 6HP
      // TODO In difficult mode enemies will have as much HP as the value of the respective card
      const enemyHp = 6;

      const enemy = new Character(enemyCard, enemyHp, enemyHp);

      return GameActions.revealed({ character, enemy });
    }),
  ));

  // Basically the same thing as bribe, but dispatches challenged()
  challenge$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.challenge),
    withLatestFrom(
      this.store.select(GameSelectors.selectCharacterDeck),
    ),
    map(([, characterIm]) => {
      const character = characterIm.clone();

      // Reveal the enemy
      const enemyCard = character.pop();

      if (!enemyCard) {
        return GameActions.error({ error: `No enemy found` });  
      }

      // In easy mode enemies always enter Combat with 6HP
      // TODO In difficult mode enemies will have as much HP as the value of the respective card
      const enemyHp = 6;

      const enemy = new Character(enemyCard, enemyHp, enemyHp);

      return GameActions.challenged({ character, enemy });
    }),
  ));

  challenged$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.challenged),
    map(() =>
      GameActions.combat()
    ),
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

      // Remove event card from event deck
      const eventCard = event.pop();

      if (!eventCard) {
        return GameActions.error({ error: 'No event card' });
      }

      if (eventCard.suit !== 'coins') {
        return GameActions.error({ error: `Event card is ${eventCard.suit} while coins where expected` });
      }

      // Place event card on gold deck
      gold.push(eventCard);

      return GameActions.collected({ event, gold });
    }),
  ));

  combat$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.combat),
    withLatestFrom(
      this.store.select(GameSelectors.selectDungeonDeck),
    ),
    map(([, dungeonIm]) => {
      const dungeon = dungeonIm.clone();

      // Pick three action card for player
      // TODO Remove cast
      const heroAction = Deck.empty();
      for (let i = 0; i < 3; i++) {
        heroAction.push(dungeon.pop() as Card);
      }

      // Pick three action card for enemy
      // TODO Remove cast
      const enemyAction = Deck.empty();
      for (let i = 0; i < 3; i++) {
        enemyAction.push(dungeon.pop() as Card);
      }

      return GameActions.combatStarted({ heroAction, enemyAction });
    }),
  ));

  combatAction = createEffect(() => this.actions$.pipe(
    ofType(GameActions.combatAction),
    withLatestFrom(
      this.store.select(GameSelectors.selectCombatAction),
    ),
    map(([, lastAction]) => {
      if (lastAction === undefined) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.combatAction.type}: lastAction=${lastAction}` });
      }

      const action = lastAction + 1;

      return GameActions.turnStart({ action });
    }),
  ));

  combatStarted$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.combatStarted),
    map(() =>
      GameActions.combatAction()
    ),
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

      // Draw a card from dungeon deck
      const dungeonCard = dungeon.pop();

      if (!dungeonCard) {
        return GameActions.error({ error: 'Dungeon deck is empty' });
      }

      // Place card on event deck
      event.push(dungeonCard);

      return GameActions.drawn({ event, dungeon });
    }),
  ));

  fight$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.fight),
    withLatestFrom(
      this.store.select(GameSelectors.selectEnemy),
      this.store.select(GameSelectors.selectEnemyNextAction),
      this.store.select(GameSelectors.selectHero),
      this.store.select(GameSelectors.selectHeroActionSelected),
    ),
    map(([, enemy, enemyAction, hero, heroActions]) => {
      const heroSuit = heroActions.peek()?.suit;
      const heroValue = heroActions.value;

      if (!enemyAction) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.fight.type}: enemyAction=${enemyAction}` });
      }

      if (!heroSuit) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.fight.type}: actionSuit=${heroSuit}` });
      }

      if (!hero || !enemy) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.fight.type}: hero=${hero}, enemy=${enemy}` });
      }

      const enemySuit = enemyAction.suit;
      const enemyValue = enemyAction.value;

      // Calculate damage made by clubs
      const heroClubs = heroSuit === 'clubs' ? heroValue : 0;
      const enemyClubs = enemySuit === 'clubs' ? enemyValue : 0;
      const parries = Math.min(heroClubs, enemyClubs);
      const heroClubAttack = heroClubs - parries;
      const enemyClubAttack = enemyClubs - parries;

      // Calculate damage made by swords
      const heroSwordAttack = heroSuit === 'swords' ? heroValue : 0;
      const enemySwordAttack = enemySuit === 'swords' ? enemyValue : 0;
      
      // Calculate total attack
      const heroTotalAttack = heroClubAttack + heroSwordAttack;
      const enemyTotalAttack = enemyClubAttack + enemySwordAttack;

      // Calculate shield granted by coins
      const heroShield = heroSuit === 'coins' ? heroValue : 0;
      const enemyShield = enemySuit === 'coins' ? enemyValue : 0;

      // Calculate total attack after shielding
      const heroShieldedAttack = Math.max(0, heroTotalAttack - enemyShield);
      const enemyShieldedAttack = Math.max(0, enemyTotalAttack - heroShield);

      // Calculate healing granted by cups
      const heroHealing = heroSuit === 'cups' ? heroValue : 0;
      const enemyHealing = enemySuit === 'cups' ? enemyValue : 0;

      // Final results
      const heroDelta = heroHealing - enemyShieldedAttack;
      const enemyDelta = enemyHealing - heroShieldedAttack;

      // console.log({
      //   enemySuit, heroClubs, enemyClubs, parries, heroClubAttack, enemyClubAttack,
      //   heroSwordAttack, enemySwordAttack,
      //   heroTotalAttack, enemyTotalAttack,
      //   heroShield,
      //   enemyShield,
      //   heroShieldedAttack,
      //   enemyShieldedAttack,
      //   heroHealing, enemyHealing,
      //   heroDelta, enemyDelta
      // })

      // Update characters
      hero = hero.updateHp(heroDelta);
      enemy = enemy?.updateHp(enemyDelta);

      return GameActions.fighted({ enemy, hero });
    }),
  ));

  resolveCard$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCard),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventCard),
      this.store.select(GameSelectors.selectDice),
    ),
    map(([, eventCard, dice]) => {
      // 1 always corresponts to a failure
      if (dice === 1) {
        return GameActions.resolveCardFailure()
      }

      // 6 always corresponts to a success
      if (dice === 6) {
        return GameActions.resolveCardSuccess();
      }

      const eventCardValue = eventCard?.value;

      if (!dice || !eventCardValue) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.resolveCard.type}: dice=${dice}, eventCardValue=${eventCardValue}` });
      }

      // From 2 to 5 the roll is successfull if the value is equal or greather thatn the event card
      // value
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

      // Player's health is decreased by VCE/2 (rounded down)
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

      // Player's health is increased by VCE
      if (eventCardSuit === 'cups') {
        hpDelta = eventCard?.value ?? 0;
      }

      return GameActions.resolvedCard({ hpDelta });
    }),
  ));

  resolveCombat$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCombat),
    withLatestFrom(
      this.store.select(GameSelectors.selectAidDeck),
      this.store.select(GameSelectors.selectEnemy),
    ),
    map(([, aidIm, enemy]) => {
      if (!enemy) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.resolveCombat.type}: enemy=${enemy}` });
      }

      // Enemy card becomes a Help card
      const aid = aidIm.clone();
      aid.push(enemy.card);

      return GameActions.resolvedCombat({ aid });
    }),
  ));

  revealedOk$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.revealedOk),
    withLatestFrom(
      this.store.select(GameSelectors.selectEnemy),
    ),
    map(([, enemy]) => {

      if (!enemy) {
        return GameActions.error({ error: `No enemy preview found` });  
      }

      // If the enemy is a king, the Combat begins
      if (enemy.card.value === 10) {
        return GameActions.combat();
      }

      // Otherwise, the combat automatically ends in you favor
      return GameActions.resolveCombat();

    }),
  ));

  spend$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.spend),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventCard),
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectGoldDeck),
      this.store.select(GameSelectors.selectGoldSelectedDeck),
    ),
    map(([, eventCard, eventIm, goldIm, selectedGold]) => {
      if (!eventCard) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.spend.type}: eventCard=${eventCard}` });
      }

      const selectedGoldValue = selectedGold.value;

      // Gold cards are placed on top of event card
      const event = eventIm.clone();
      const gold = goldIm.clone();
      selectedGold.cards.forEach(card => {
        gold.remove(card);
        event.push(card);
      });

      return GameActions.spent({ eventCard, event, gold, selectedGoldValue });
    }),
  ));

  spent$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.spent),
    map(({ eventCard, selectedGoldValue }) => {
      const eventCardSuit = eventCard.suit;

      // Spending a total sum equal or greater than the value of the Event Card, the Resolution is
      // automatically successfull
      if (eventCardSuit === 'clubs' || eventCardSuit === 'cups') {
        return GameActions.resolveCardSuccess();
      }
      
      const eventCardValue = eventCard.value;

      // Spending an amount of gold equal to the value of the Event Card continues the Crawling
      // phase without engaging in combat
      if (eventCardSuit === 'swords' && selectedGoldValue === eventCardValue) {
        return GameActions.resolveCardSuccess();
      }

      // In easy mode, by spending an amount of gold greather than the value of the Event card, you
      // reveal the enemy
      if (eventCardSuit === 'swords' && selectedGoldValue > eventCardValue) {
        return GameActions.bribe();
      }

      // TODO In hard mode, you have to spend twice the gold of the event card value
      // This check should be done before launching spent action
      if (eventCardSuit === 'swords' && selectedGoldValue === eventCardValue * 2) {

      }

      return GameActions.error({ error: `Invalid state for action ${GameActions.spent.type}: eventCardSuit=${eventCardSuit}, selectedGoldValue=${selectedGoldValue}` });
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
      const hero = new Character(new Card(8, 'swords'), 12, 12);

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
      dungeon.push(new Card(4, 'swords'));
      dungeon.push(new Card(4, 'clubs'));
      dungeon.push(new Card(5, 'clubs'));
      dungeon.push(new Card(4, 'cups'));
      dungeon.push(new Card(5, 'cups'));
      dungeon.push(new Card(6, 'cups'));
      dungeon.push(new Card(2, 'cups'));

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
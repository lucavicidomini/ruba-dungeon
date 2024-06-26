import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { Card } from '../+models/card.model';
import { Character } from '../+models/character.model';
import { Deck } from '../+models/deck.model';
import { AppState } from './app.reducer';
import * as GameActions from './game.actions';
import { PartialDeckState } from './game.reducer';
import * as GameSelectors from './game.selectors';
import { LoggerService } from '../logger.service';
import { MenuFacade } from './menu.facade';
import { TutorialFacade } from './tutorial.facade';

@Injectable()
export class GamesEffects {

  DEBUG = false;

  /*
   * If dungeon deck is empty, reshuffle using event deck
   */
  reshuffle(currentDungeon: Deck, currentEvent: Deck) {
    if (currentDungeon.length) {
      return { dungeon: currentDungeon, event: currentEvent };
    }

    const dungeon = currentEvent.clone();
    dungeon.shuffle();
    const event = Deck.empty();

    this.logger.reshuffle();

    return  { dungeon, event };
  }

  actionPlay$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.actionPlay),
    withLatestFrom(
      this.store.select(GameSelectors.selectAidDeck),
      this.store.select(GameSelectors.selectAidSelectedDeck),
      this.store.select(GameSelectors.selectCatacombDeck),
      this.store.select(GameSelectors.selectEnemy),
      this.store.select(GameSelectors.selectEnemyActions),
      this.store.select(GameSelectors.selectEnemyActionSelected),
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectHero),
      this.store.select(GameSelectors.selectHeroAction),
      this.store.select(GameSelectors.selectHeroActionSelected),
      this.store.select(GameSelectors.selectObtainedRelicDeck),
    ),
    map(([{ suit }, aidIm, aidSelected, catacombIm, enemy, enemyActionDeckIm, enemyActionSelected, eventIm, hero, heroActionIm, heroActionSelected, obtainedRelic]) => {
      // If the hero has no action, heroValue=0 and heroSuit is irrelevant
      const heroRelic = suit ? obtainedRelic.filterBySuit(suit).value : 0;
      const heroAid = suit ? aidSelected.filterBySuit(suit).length : 0;
      const heroSuit = suit ?? 'clubs';
      const heroValue = heroActionSelected.value + heroRelic + heroAid;

      if (!enemyActionSelected) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.actionPlay.type}: enemyAction=${enemyActionSelected}` });
      }

      if (!hero || !enemy) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.actionPlay.type}: hero=${hero}, enemy=${enemy}` });
      }

      const enemySuit = enemyActionSelected.suit;
      const enemyValue = enemyActionSelected.value;

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

      // Update characters
      hero = hero.updateHp(heroDelta);
      enemy = enemy?.updateHp(enemyDelta);

      // Update enemy action cards
      const enemyActionDeck = enemyActionDeckIm.clone();
      enemyActionDeck.pop();

      // Update hero action cards
      const heroAction = heroActionIm.clone();
      heroAction.removeAll(heroActionSelected);

      // Resolved action cards should be placed on Event Cards
      const event = eventIm.clone();
      event.push(enemyActionSelected);
      event.pushAll(heroActionSelected);

      // On easy mode, played help cards are sent to Catacomb
      const aid = aidIm.clone();
      aid.removeAll(aidSelected);
      const catacomb = catacombIm.clone();
      catacomb.pushAll(aidSelected);

      this.logger.actionPlay(
        aidSelected,
        enemyActionSelected,
        enemyClubAttack,
        enemyDelta,
        enemyHealing,
        enemyShield,
        enemySwordAttack,
        heroActionSelected,
        heroClubAttack,
        heroDelta,
        heroHealing,
        heroRelic,
        heroShield,
        heroSwordAttack,
        parries,
        suit,
      );

      return GameActions.actionPlayed({ aid, catacomb, enemy, enemyAction: enemyActionDeck, event, hero, heroAction });
    }),
  ));

  actionPlayed$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.actionPlayed),
    withLatestFrom(
      this.store.select(GameSelectors.selectEnemy),
      this.store.select(GameSelectors.selectEnemyActionSelected),
      this.store.select(GameSelectors.selectHero),
    ),
    map(([, enemy, enemyActionSelected, hero]) => {
      if (!hero || !enemy) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.actionPlayed.type}: hero=${hero}, enemy=${enemy}` });
      }

      if (!hero.hp) {
        return GameActions.gameOver();
      }

      if (!enemy.hp) {
        return GameActions.resolveCombat({ bribed: false });
      }

      // No more enemy action cards, start a new turn
      if (!enemyActionSelected) {
        return GameActions.turnStart();
      }

      return GameActions.actionStart();
    }),
  ));

  actionStart$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.actionStart),
    withLatestFrom(
      this.store.select(GameSelectors.selectCombatAction),
    ),
    map(([, lastAction]) => {
      if (lastAction === undefined) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.actionStart.type}: lastAction=${lastAction}` });
      }

      const action = lastAction + 1;

      this.logger.actionStart(action);

      return GameActions.actionStarted({ action });
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

      this.logger.challenge(enemy);

      return GameActions.challenged({ character, enemy });
    }),
  ));

  challenged$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.challenged),
    map(() => GameActions.combatStart()),
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

      this.logger.collect(eventCard);

      return GameActions.collected({ event, gold });
    }),
  ));

  combat$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.combatStart),
    map(() => GameActions.combatStarted()),
  ));

  combatStarted$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.combatStarted),
    map(() => GameActions.turnStart()),
  ));

  draw$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.draw),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectDungeonDeck),
    ),
    map(([, eventIm, dungeonIm]) => {
      let event = eventIm.clone();
      let dungeon = dungeonIm.clone();

      // Draw a card from dungeon deck
      ({ dungeon, event } = this.reshuffle(dungeon, event));
      const dungeonCard = dungeon.pop();

      if (!dungeonCard) {
        return GameActions.error({ error: 'Dungeon deck is empty' });
      }

      // Place card on event deck
      event.push(dungeonCard);

      this.logger.draw(dungeonCard);

      return GameActions.drawn({ event, dungeon });
    }),
  ));

  keepSelectedAction$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.keepSelectedAction),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectHeroActionSelected),
      this.store.select(GameSelectors.selectHeroAction),
    ),
    map(([{ action }, eventIm, actionSelected, heroActionIm]) => {
      const unselectedAction = heroActionIm.clone();
      unselectedAction.removeAll(action == 'keep' ? actionSelected : Deck.empty());

      const heroAction = heroActionIm.clone();
      heroAction.removeAll(unselectedAction);

      const event = eventIm.clone();
      event.pushAll(unselectedAction);

      this.logger.keepSelectedAction(heroAction, unselectedAction);

      return GameActions.keptSelectedAction({ heroAction, event });
    }),
  ));

  newGame$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.start),
    tap(() => this.menuFacade.newGame(false)),
    filter(() => false),
  ));

  resolveCard$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCardByDice),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventCard),
      this.store.select(GameSelectors.selectDice),
    ),
    map(([, eventCard, dice]) => {
      if (!dice || !eventCard) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.resolveCardByDice.type}: dice=${dice}, eventCard=${eventCard}` });
      }

      // 1 always corresponts to a failure
      if (dice === 1) {
        return GameActions.resolveCardFailure({ eventCard })
      }

      // 6 always corresponts to a success
      if (dice === 6) {
        return GameActions.resolveCardSuccess({ eventCard });
      }

      const eventCardValue = eventCard?.value;

      // From 2 to 5 the roll is successfull if the value is equal or greather thatn the event card
      // value
      if (dice >= eventCardValue) {
        return GameActions.resolveCardSuccess({ eventCard });
      }

      return GameActions.resolveCardFailure({ eventCard });
    }),
  ));

  resolveCardFailure$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCardFailure),
    map(({ eventCard }) => {
      const eventCardSuit = eventCard.suit;
      let hpDelta = 0;

      // Player's health is decreased by VCE/2 (rounded down)
      if (eventCardSuit === 'clubs' || eventCardSuit == 'cups') {
        hpDelta = -Math.floor(eventCard.value / 2);
      }

      this.logger.resolveCardFailure(eventCard, hpDelta);

      return GameActions.resolvedCard({ hpDelta });
    }),
  ));

  resolveCardSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCardSuccess),
    map(({ eventCard }) => {
      const eventCardSuit = eventCard.suit;
      let hpDelta = 0;

      // Player's health is increased by VCE
      if (eventCardSuit === 'cups') {
        hpDelta = eventCard.value;
      }

      this.logger.resolveCardSuccess(eventCard, hpDelta);

      return GameActions.resolvedCard({ hpDelta });
    }),
  ));

  resolvedCard$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolvedCard),
    withLatestFrom(
      this.store.select(GameSelectors.selectHero),
    ),
    tap(([, hero]) => hero && this.logger.resolvedCard(hero.hp)),
    filter(([, hero]) => hero?.hp === 0),
    map(() => GameActions.gameOver()),
  ));

  resolveCombat$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolveCombat),
    withLatestFrom(
      this.store.select(GameSelectors.selectAidDeck),
      this.store.select(GameSelectors.selectEnemy),
      this.store.select(GameSelectors.selectEnemyActions),
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectHeroAction),
      this.store.select(GameSelectors.selectObtainedRelicDeck),
      this.store.select(GameSelectors.selectRelicDeck),
    ),
    map(([{ bribed }, aidIm, enemy, enemyAction, eventIm, heroAction, obtainedRelicIm, relicIm]) => {
      if (!enemy) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.resolveCombat.type}: enemy=${enemy}` });
      }

      // Enemy card becomes an aid card
      const aid = aidIm.clone();
      aid.push(enemy.card);

      // If enemy is a king, player obtains a relic
      const obtainedRelic = obtainedRelicIm.clone();
      const relic = relicIm.clone();
      if (enemy.card.value === 10) {
        const relicCard = new Card(1, enemy.card.suit);
        relic.remove(relicCard);
        obtainedRelic.push(relicCard);
      }

      // Remaining enemy actions are moved to event
      const event = eventIm.clone();
      event.pushAll(enemyAction);

      return GameActions.resolvedCombat({ aid, bribed, event, heroAction, obtainedRelic, relic });
    }),
  ));

  resolvedCombatDiscardAction$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolvedCombat),
    withLatestFrom(
      this.store.select(GameSelectors.selectHeroAction),
    ),
    filter(([{ bribed }, heroAction]) => !bribed && heroAction.length > 0),
    map(() => GameActions.discardAction()),
  ));

  resolvedCombatGameWon$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.resolvedCombat),
    withLatestFrom(
      this.store.select(GameSelectors.selectObtainedRelicDeck),
    ),
    filter(([, obtainedRelic]) => obtainedRelic.length === 4),
    map(() => GameActions.gameWon()),
  ));

  reveal$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.reveal),
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

      this.logger.reveal(enemy);

      return GameActions.revealed({ character, enemy });
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
        return GameActions.combatStart();
      }

      // Otherwise, the combat automatically ends in you favor
      return GameActions.resolveCombat({ bribed: true });
    }),
  ));

  skip$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.skip),
    withLatestFrom(
      this.store.select(GameSelectors.selectEventCard),
    ),
    map(([, eventCard]) => {
      if (!eventCard) {
        return GameActions.error({ error: `Invalid state for action ${GameActions.spend.type}: eventCard=${eventCard}` });
      }

      this.logger.skip(eventCard);

      return GameActions.skipped();
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
        return GameActions.resolveCardSuccess({ eventCard });
      }
      
      const eventCardValue = eventCard.value;

      // Spending an amount of gold equal to the value of the Event Card continues the Crawling
      // phase without engaging in combat
      if (eventCardSuit === 'swords' && selectedGoldValue === eventCardValue) {
        return GameActions.resolveCardSuccess({ eventCard });
      }

      // In easy mode, by spending an amount of gold greather than the value of the Event card, you
      // reveal the enemy
      if (eventCardSuit === 'swords' && selectedGoldValue > eventCardValue) {
        return GameActions.reveal();
      }

      // TODO In hard mode, you have to spend twice the gold of the event card value
      // This check should be done before launching spent action
      if (eventCardSuit === 'swords' && selectedGoldValue === eventCardValue * 2) {

      }

      return GameActions.error({ error: `Invalid state for action ${GameActions.spent.type}: eventCardSuit=${eventCardSuit}, selectedGoldValue=${selectedGoldValue}` });
    }),
  ));

  start$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.start),
    withLatestFrom(
      this.tutorialFacade.index$,
    ),
    filter(([, tutorial]) => !this.DEBUG && tutorial === undefined),
    tap(() => this.menuFacade.about(false)),
    map(() => {
        const dungeon = Deck.full();
        dungeon.shuffle();
        const hero = new Character(dungeon.popPlayerCard(), 12, 12);
        const character = dungeon.extractCharacterDeck();
        const relic = dungeon.extractRelicDeck();
        const decks: PartialDeckState = { dungeon, character, relic };
        return GameActions.started({ decks, hero });
    }),
  ));

  startDebug$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.start),
    filter(() => this.DEBUG),
    tap(() => this.menuFacade.about(false)),
    map(() => {
      const hero = new Character(new Card(8, 'swords'), 12, 12);

      const character = Deck.empty();
      character.push(new Card(10, 'swords'));
      character.push(new Card(10, 'clubs'));
      character.push(new Card(10, 'coins'));
      character.push(new Card(10, 'cups'));
      character.push(new Card(8, 'clubs'));
      character.push(new Card(9, 'clubs'));
      character.push(new Card(8, 'coins'));
      character.push(new Card(9, 'coins'));
      character.push(new Card(8, 'cups'));
      character.push(new Card(9, 'cups'));
      character.push(new Card(9, 'swords'));

      const relic = Deck.empty();
      relic.push(new Card(1, 'clubs'));
      relic.push(new Card(1, 'coins'));
      relic.push(new Card(1, 'cups'));
      relic.push(new Card(1, 'swords'));
      character.reverse();

      const dungeon = Deck.empty();
      for (let i = 0; i < 4; i++) {
        dungeon.push(new Card(4, 'swords'));
        dungeon.push(new Card(7, 'swords'));
        dungeon.push(new Card(7, 'cups'));
        dungeon.push(new Card(5, 'swords'));
        dungeon.push(new Card(3, 'swords'));
        dungeon.push(new Card(2, 'swords'));
        dungeon.push(new Card(1, 'swords'));
      }
      
      dungeon.reverse();
      
      const decks: PartialDeckState = { dungeon, character, relic };
      return GameActions.started({ decks, hero });
    }),
  ));

  startTutorial$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.start),
    withLatestFrom(
      this.tutorialFacade.index$,
    ),
    filter(([, tutorial]) => tutorial !== undefined),
    tap(() => this.menuFacade.about(false)),
    map(() => {
      const hero = new Character(new Card(9, 'swords'), 12, 12);

      const character = Deck.empty();
      character.push(new Card(10, 'clubs'));
      character.push(new Card(8, 'cups'));
      character.push(new Card(10, 'swords'));
      character.reverse();

      const relic = Deck.empty();
      relic.push(new Card(1, 'clubs'));
      relic.push(new Card(1, 'coins'));
      relic.push(new Card(1, 'cups'));
      relic.push(new Card(1, 'swords'));

      const dungeon = Deck.empty();
      // Crawling
      dungeon.push(new Card(3, 'coins'));  // Collect
      dungeon.push(new Card(2, 'coins'));  // Collect
      dungeon.push(new Card(7, 'clubs'));  // Trap
      dungeon.push(new Card(4, 'cups'));   // Concoction
      dungeon.push(new Card(3, 'swords')); // Combat
      // Combat 1 - Turn 1 - Hero actions
      dungeon.push(new Card(4, 'coins')); 
      dungeon.push(new Card(6, 'clubs'));
      dungeon.push(new Card(3, 'clubs'));
      // Combat 1 - Turn 1 - Enemy actions
      dungeon.push(new Card(6, 'swords'));
      dungeon.push(new Card(4, 'clubs'));
      dungeon.push(new Card(5, 'swords'));
      // Combat 1 - Turn 2 - Hero actions
      dungeon.push(new Card(4, 'swords'));
      dungeon.push(new Card(4, 'clubs'));
      dungeon.push(new Card(4, 'coins'));
      // Combat 1 - Turn 2 - Enemy actions
      dungeon.push(new Card(3, 'coins'));  // Hidden
      dungeon.push(new Card(2, 'cups'));
      dungeon.push(new Card(7, 'cups'));
      // Crawling
      dungeon.push(new Card(5, 'coins'));  // Collect
      dungeon.push(new Card(5, 'swords')); // Skip combat
      dungeon.push(new Card(6, 'coins'));  // Collect
      dungeon.push(new Card(7, 'coins'));  // Collect
      dungeon.push(new Card(4, 'swords')); // Bribe (8 Cups)
      dungeon.push(new Card(2, 'swords')); // Bribe (10 Sword)
      // Combat 2 - Turn 1 - Hero actions
      dungeon.push(new Card(2, 'cups'));
      dungeon.push(new Card(3, 'clubs'));
      dungeon.push(new Card(2, 'coins'));
      // Combat 2 - Turn 1 - Enemy actions
      dungeon.push(new Card(3, 'coins'));
      dungeon.push(new Card(4, 'clubs'));
      dungeon.push(new Card(7, 'swords'));
      // Combat 2 - Turn 2 - Hero actions
      dungeon.push(new Card(6, 'clubs'));
      dungeon.push(new Card(5, 'coins'));
      dungeon.push(new Card(3, 'cups'));
      // Combat 2 - Turn 2 - Enemy actions
      dungeon.push(new Card(2, 'clubs')); // hidden
      dungeon.push(new Card(2, 'clubs')); // hidden
      dungeon.push(new Card(2, 'clubs'));
      
      dungeon.reverse();
      
      const decks: PartialDeckState = { dungeon, character, relic };
      return GameActions.started({ decks, hero });
    }),
  ));

  throwDice$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.throwDice),
    withLatestFrom(
      this.tutorialFacade.index$,
    ),
    map(([, tutorialIndex]) => {
      const isTutorial = tutorialIndex !== undefined;

      const dice = isTutorial ? 5 : Math.floor(Math.random() * 6 + 1);

      this.logger.throwDice(dice);

      return GameActions.threwDice({ dice });
    }),
  ));

  turnStart$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.turnStart),
    withLatestFrom(
      this.store.select(GameSelectors.selectDungeonDeck),
      this.store.select(GameSelectors.selectEventDeck),
      this.store.select(GameSelectors.selectHeroAction),
    ),
    map(([, dungeonIm, eventIm, heroActionIm]) => {
      let dungeon = dungeonIm.clone();
      let event = eventIm.clone();
   
      // Pick three action card for player
      const heroAction = heroActionIm.clone();
      const missingCount = 3 - heroAction.length;
      for (let i = 0; i < missingCount; i++) {
        ({ dungeon, event } = this.reshuffle(dungeon, event));
        heroAction.push(dungeon.pop()!);
      }

      // Pick three action card for enemy
      const enemyAction = Deck.empty();
      for (let i = 0; i < 3; i++) {
        ({ dungeon, event } = this.reshuffle(dungeon, event));
        enemyAction.push(dungeon.pop()!);
      }

      return GameActions.turnStarted({ dungeon, event, enemyAction, heroAction });
    }),
  ));

  turnStarted$ = createEffect(() => this.actions$.pipe(
    ofType(GameActions.turnStarted),
    map(() => GameActions.actionStart()),
  ));

  constructor(
    private actions$: Actions,
    private menuFacade: MenuFacade,
    private tutorialFacade: TutorialFacade,
    private logger: LoggerService,
    private store: Store<AppState>,
  ) {}
}
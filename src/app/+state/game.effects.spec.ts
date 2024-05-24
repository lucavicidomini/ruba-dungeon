import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { GamesEffects } from './game.effects';
import * as GameSelectors from './game.selectors';
import * as GameActions from './game.actions';
import { Character } from '../+models/character.model';
import { Card } from '../+models/card.model';
import { Deck } from '../+models/deck.model';
import { addMatchers, hot, initTestScheduler } from 'jasmine-marbles';

describe('ProductEffects', () => {
  let actions$: Observable<any>;

  let effects: GamesEffects;

  const ENEMY_CARD = new Card(8, 'clubs');
  const HERO_CARD = new Card(8, 'coins');

  const ENEMY_HP = 6;
  const HERO_HP = 12;

  const ENEMY_MAX_HP = 6;
  const HERO_MAX_HP = 12;

  let initialEnemy: Character;
  let initialHero: Character;

  const mockTurn = (enemyAction: Card, heroAction: Card | Card[], enemyHp = ENEMY_HP, heroHp = HERO_HP) => {
    const heroActionSelected = Deck.empty();
    (Array.isArray(heroAction) ? heroAction : [heroAction]).forEach(card => heroActionSelected.push(card));

    initialEnemy = new Character(ENEMY_CARD, enemyHp, ENEMY_MAX_HP);
    initialHero = new Character(HERO_CARD, heroHp, HERO_MAX_HP);

    TestBed.configureTestingModule({
      providers: [
        GamesEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: GameSelectors.selectEnemy, value: initialEnemy },
            { selector: GameSelectors.selectEnemyActionSelected, value: enemyAction },
            { selector: GameSelectors.selectHero, value: initialHero },
            { selector: GameSelectors.selectHeroActionSelected, value: heroActionSelected },
          ]
        })
      ],
    });
    effects = TestBed.inject(GamesEffects);
  };

  const expectHp = (enemyHp: number, heroHp: number) => {
    actions$ = hot('a', { a: GameActions.fight() });
    
    const enemy = new Character(ENEMY_CARD, enemyHp, 6);
    const hero = new Character(HERO_CARD, heroHp, 12);
    const expected = hot('a', { a: GameActions.fighted({ enemy, hero }) });

    expect(effects.fight$).toBeObservable(expected);
  }

  const expectDelta = (enemyDelta: number, heroDelta: number) =>
    expectHp(
      Math.max(0, Math.min(initialEnemy.hp + enemyDelta, ENEMY_MAX_HP)),
      Math.max(0, Math.min(initialHero.hp + heroDelta, HERO_MAX_HP))
    );

  beforeEach(() => {
    initTestScheduler();
    addMatchers();
  })

  describe('Parrying', () => {
    it('When ENEMY plays 2Clubs and HERO plays 5Clubs, Then ENEMY loses 3 hp', () => {
      mockTurn(new Card(2, 'clubs'), [new Card(5, 'clubs')]);
      expectDelta(-3, 0);
    });
  
    it('When ENEMY plays 5Clubs and HERO plays 2Clubs, Then HERO loses 3 hp', () => {
      mockTurn(new Card(5, 'clubs'), [new Card(2, 'clubs')]);
      expectDelta(0, -3);
    });
  
    it('When HERO plays 2Clubs and ENEMY plays 2Clubs, Then nothing changes', () => {
      // Yeah, should not happen in-game, but it is for code validity
      mockTurn(new Card(2, 'clubs'), [new Card(2, 'clubs')]);
      expectDelta(0, 0);
    });
  });

  describe('Both attacking', () => {
    it('When ENEMY plays 2Clubs and HERO plays 5Swords, Then ENEMY loses 5 hp and HERO loses 5 hp', () => {
      mockTurn(new Card(2, 'clubs'), [new Card(5, 'swords')]);
      expectDelta(-5, -2);
    });

    it('When ENEMY plays 2Swords and HERO plays 5Clubs, Then ENEMY loses 5 hp and HERO loses 5 hp', () => {
      mockTurn(new Card(2, 'swords'), [new Card(5, 'clubs')]);
      expectDelta(-5, -2);
    });

    it('When ENEMY plays 2Swords and HERO plays 5clubs, Then ENEMY loses 5 hp and HERO loses 5 hp', () => {
      mockTurn(new Card(2, 'swords'), [new Card(5, 'clubs')]);
      expectDelta(-5, -2);
    });

    it('When ENEMY plays 2Clubs and HERO plays 5Swords, Then ENEMY loses 5 hp and HERO loses 5 hp', () => {
      mockTurn(new Card(2, 'clubs'), [new Card(5, 'swords')]);
      expectDelta(-5, -2);
    });
  });

  describe('Healing', () => {
    it('When ENEMY plays 3Cups and HERO plays 5Swords, Then ENEMY loses 2 hp', () => {
      mockTurn(new Card(3, 'cups'), [new Card(5, 'swords')]);
      expectDelta(-2, 0);
    });

    it('When ENEMY plays 5Cups and HERO plays 5Swords, Then nothing changes', () => {
      mockTurn(new Card(5, 'cups'), [new Card(5, 'swords')]);
      expectDelta(0, 0);
    });

    it('When ENEMY plays 7Cups and HERO plays 5Swords, Then nothing changes', () => {
      mockTurn(new Card(7, 'cups'), [new Card(5, 'swords')]);
      expectDelta(0, 0);
    });

    it('When ENEMY plays 3Cups and HERO plays 7Swords, Then ENEMY is left with 2 hp', () => {
      mockTurn(new Card(3, 'cups'), [new Card(7, 'swords')]);
      expectHp(2, HERO_HP);
    });
  });

  describe('Examples from ruleset', () => {
    it('When ENEMY plays 4Sword and HERO plays 8Cups, Then PLAYER gains 4 hp', () => {
      mockTurn(new Card(4, 'swords'), [new Card(8, 'cups')], ENEMY_HP, 4);
      expectDelta(0, 4);
    });

    it('When ENEMY plays 8Cups and HERO plays 4Sword, Then PLAYER gains 4 hp', () => {
      mockTurn(new Card(8, 'cups'), [new Card(4, 'swords')], ENEMY_HP, 4);
      expectDelta(4, 0);
    });

    it('When ENEMY plays 3Coins and HERO plays 8Swords, Then ENEMY loses 5 hp', () => {
      mockTurn(new Card(3, 'coins'), [new Card(8, 'swords')]);
      expectDelta(-5, 0);
    });

    it('When ENEMY plays 4Cups and HERO plays 4cups, Then ENEMY gains 4 hp And HERO gains 3 hp', () => {
      mockTurn(new Card(4, 'cups'), [new Card(3, 'cups')], 1, 1);
      expectDelta(4, 3);
    });
  });
  
});

import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, filter, fromEvent, map, merge, takeUntil, tap, withLatestFrom } from 'rxjs';
import { SuitLabels, Suits } from '../+models/card.model';
import { Deck } from '../+models/deck.model';
import { GameStatus, KeepDiscardAction } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';

interface PlayButton {
  disabled: boolean,
  caption: string,
  shortcut: string,
  suit?: Suits,
}

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss'
})
export class ActionBarComponent implements OnInit, OnDestroy {

  playActionShortcuts: Record<Suits, string> = {
    'clubs': 'l',
    'coins': 'o',
    'cups': 'u',
    'swords': 'w'
  };

  aidSelected$ = this.gameFacade.aidSelectedDeck$;

  heroAction$ = this.gameFacade.heroAction$;

  heroActionSelected$ = this.gameFacade.heroActionSelectedDeck$;

  destroy$ = new Subject<void>();
 
  dice$ = this.gameFacade.dice$;

  enemy$ = this.gameFacade.enemy$;

  goldSelected$ = this.gameFacade.goldSelectedDeck$;

  eventCard$ = this.gameFacade.eventCard$;

  obtainedRelic$ = this.gameFacade.obtainedRelicDeck$;
  
  status$ = this.gameFacade.status$;

  disableKeep$ = this.heroActionSelected$.pipe(
    map(heroActionSelected => !heroActionSelected.length),
  );

  disableSpend$ = combineLatest([this.eventCard$, this.goldSelected$]).pipe(
    map(([eventCard, goldSelected]) => eventCard && goldSelected.value < eventCard.value),
  );

  showDraw$ = this.status$.pipe(
    map(status => status === GameStatus.CRAWL_READY),
  );

  showCollect$ = combineLatest([this.eventCard$, this.status$]).pipe(
    map(([eventCard, status]) => status === GameStatus.CRAWL_ACT && eventCard?.suit === 'coins'),
  );

  showCombat$ = combineLatest([this.eventCard$, this.status$]).pipe(
    map(([eventCard, status]) => status === GameStatus.CRAWL_ACT && eventCard?.suit === 'swords'),
  );

  showDice$ = combineLatest([this.eventCard$, this.status$]).pipe(
    map(([eventCard, status]) => status === GameStatus.CRAWL_ACT && (eventCard?.suit === 'clubs' || eventCard?.suit === 'cups')),
  );

  showDiceFeedback$ = this.status$.pipe(
    map(status => status === GameStatus.RESOLVE_THREW_DICE),
  );

  showKeep$ = this.status$.pipe(
    map(status => status === GameStatus.DISCARD_ACTION),
  );

  showSkip$ = combineLatest([this.eventCard$, this.status$]).pipe(
    map(([eventCard, status]) => status === GameStatus.CRAWL_ACT && eventCard?.suit === 'cups'),
  );

  mapSelectedActionToSuit = (selectedActions: Deck) => Array.from(new Set(selectedActions.cards.map(card => card.suit)).values()).sort()

  mapSuitToButton = (aidSelected: Deck, heroAction: Deck, heroActionSelected: Deck, suit: Suits): PlayButton => {
    const disablePlay = heroAction.length && !heroActionSelected.length;
    const aidSuit = aidSelected.peek()?.suit;
    const disableSuit = suit && aidSuit ? aidSuit !== suit : false;
    const caption = SuitLabels[suit].replace(/^(.)(.)(.*)$/, '$1<u>$2</u>$3');

    return {
      disabled: disablePlay || disableSuit,
      caption: `Play ${caption}`,
      shortcut: this.playActionShortcuts[suit],
      suit,
    }
  }

  mapEmptyButtons = (heroAction: Deck, buttons: PlayButton[]): PlayButton[] => heroAction.length ? buttons : ([{ disabled: false, caption: 'Play', shortcut: 'c' }]);

  playActions$ = combineLatest([this.aidSelected$, this.heroAction$, this.heroActionSelected$, this.status$]).pipe(
    map(([ aidSelected, heroAction, heroActionSelected, status ]) => ({ aidSelected, heroAction, heroActionSelected, status })),
    // Map heroActionSelected to selectedSuits
    map(({ aidSelected, heroAction, heroActionSelected, status }) => ({ aidSelected, heroAction, heroActionSelected, selectedSuits: this.mapSelectedActionToSuit(heroActionSelected), status })),
    // Map selectedSuits to buttons
    map(({ aidSelected, heroAction, heroActionSelected, selectedSuits, status }) => ({ heroAction, buttons: selectedSuits.map(suit => this.mapSuitToButton(aidSelected, heroAction, heroActionSelected, suit)), status })),
    // If there is no card to select (e.g. player previously used a combo), display a button without suit
    map(({ heroAction, buttons, status }) => ({ buttons: this.mapEmptyButtons(heroAction, buttons), status })),
    // Only show buttons in COMBAT phase
    map(({ buttons, status }) => status === GameStatus.COMBAT ? buttons : []),
  );

  playActionsShortcuts$ = this.playActions$.pipe(
    map(playActions => Object.fromEntries(
      playActions.map(({ shortcut, suit }) => [shortcut, suit])
    )),
  );

  showRevealAid$ = combineLatest([this.enemy$, this.status$]).pipe(
    map(([enemy, status]) => ({ enemyValue: enemy?.card.value ?? '', status })),
    map(({ enemyValue, status }) => status === GameStatus.ENEMY_REVEALED && enemyValue !== 10),
  );

  showRevealCombat$ = combineLatest([this.enemy$, this.status$]).pipe(
    map(([enemy, status]) => ({ enemyValue: enemy?.card.value ?? '', status })),
    map(({ enemyValue, status }) => status === GameStatus.ENEMY_REVEALED && enemyValue === 10),
  );

  showShortcuts$ = merge(
    fromEvent(document, 'keydown'),
    fromEvent(document, 'keyup'),
  ).pipe(
    takeUntil(this.destroy$),
    map(e => (e as KeyboardEvent).shiftKey),
  );

  showSpend$ = combineLatest([this.eventCard$, this.status$]).pipe(
    map(([eventCard, status]) => status === GameStatus.CRAWL_ACT && eventCard?.suit !== 'coins'),
  );

  spendCaption$ = this.eventCard$.pipe(
    map(eventCard => eventCard?.suit === 'swords' ? 'ribe' : 'uy'),
  );

  constructor(
    private gameFacade: GameFacade,
  ) {}

  caption(button: PlayButton, aidSelected: Deck, obtainedRelic: Deck) {
    if (!button.suit) {
      return button.caption;
    }

    const bonus = obtainedRelic.filterBySuit(button.suit).length + aidSelected.filterBySuit(button.suit).length;

    const captionBonus = bonus ? ` (+${bonus})` : '';
    return `${button.caption}${captionBonus}`;
  }

  onDraw() {
    this.gameFacade.draw();
  }

  onCollect() {
    this.gameFacade.collect();
  }

  onCombat() {
    this.gameFacade.challenge();
  }

  onDice() {
    this.gameFacade.throwDice();
  }

  onDiceFeedback() {
    this.gameFacade.resolveCardByDice();
  }

  onPlayAction(suit?: Suits) {
    this.gameFacade.fight(suit);
  }

  onKeep(action: KeepDiscardAction) {
    this.gameFacade.keepSelectedAction(action);
  }

  onRevealedOk() {
    this.gameFacade.revealedOk();
  }

  onSpend() {
    this.gameFacade.spend();
  }

  onSkip() {
    this.gameFacade.skip();
  }

  ngOnInit(): void {
    fromEvent(document, 'keydown').pipe(
      takeUntil(this.destroy$),
      map(e => (e as KeyboardEvent).key.toLocaleLowerCase()),
      filter(key => /^[a-z]$/.test(key)),
      withLatestFrom(
        this.disableKeep$,
        this.disableSpend$,
        this.playActions$,
        this.playActionsShortcuts$,
        this.showCollect$,
        this.showCombat$,
        this.showDice$,
        this.showDiceFeedback$,
        this.showDraw$,
        this.showKeep$,
        this.showRevealAid$,
        this.showRevealCombat$,
        this.showSpend$,
        this.showSkip$,
      ),
      tap(([
        key,
        disableKeep,
        disableSpend,
        playActions,
        playActionsShortcuts,
        showCollect,
        showCombat,
        showDice,
        showDiceFeedback,
        showDraw,
        showKeep,
        showRevealAid,
        showRevealCombat,
        showSpend,
        showSkip,
      ]) => {
        switch (key) {
          case 'a':
            // <A>ccept aid
            showRevealAid && this.onRevealedOk();
            break;
          case 'b':
            // <B>uy, <B>ribe
            showSpend && !disableSpend && this.onSpend();
            break;
          case 'c':
            // <C>ombat (event card is swords)
            showCombat && this.onCombat();
            // <C>ollect
            showCollect && this.onCollect();
            // <C>ombat (tried to bribe a King)
            showRevealCombat && this.onRevealedOk();
            // If there is a single suit to play (or no suit at all), use "c" shortcut
            playActions.length === 1 && this.onPlayAction(playActions[0].suit);
            break;
          case 'd':
            // <D>raw
            showDraw && this.onDraw();
            // <D>ice
            showDice && this.onDice();
            // <D>ice got X
            showDiceFeedback && this.onDiceFeedback();
            // <D>iscard
            showKeep && this.onKeep('discard');
            break;
          case 'k':
            // <K>eep <s>elected
            showKeep && !disableKeep && this.onKeep('keep');
            break;

          case 's':
            // <K>eep <s>elected
            showKeep && !disableKeep && this.onKeep('keep');
            showSkip && this.onSkip();
            break;
        }

        // C<l>ubs, C<o>ins, C<u>ps, S<w>ord
        playActionsShortcuts[key] && this.onPlayAction(playActionsShortcuts[key]);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { combineLatest, filter, map } from 'rxjs';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { SuitLabels, Suits } from '../+models/card.model';
import { Deck } from '../+models/deck.model';

interface PlayButton {
  disabled: boolean,
  caption: string,
  suit?: Suits,
}

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss'
})
export class ActionBarComponent {

  aidSelected$ = this.gameFacade.aidSelectedDeck$;

  heroAction$ = this.gameFacade.heroAction$;

  heroActionSelected$ = this.gameFacade.heroActionSelectedDeck$;
 
  dice$ = this.gameFacade.dice$;

  goldSelected$ = this.gameFacade.goldSelectedDeck$;

  eventCard$ = this.gameFacade.eventCard$;
  
  status$ = this.gameFacade.status$;

  disableSpend$ = combineLatest([this.eventCard$, this.goldSelected$]).pipe(
    map(([eventCard, goldSelected]) => eventCard && goldSelected.value < eventCard.value),
  );

  revealOkCaption$ = this.gameFacade.enemy$.pipe(
    map(enemy => enemy?.card.value ?? ''),
    map(enemyValue => enemyValue === 10 ? 'Combat' : 'Accept aid'),
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

  mapSelectedActionToSuit = (selectedActions: Deck) => Array.from(new Set(selectedActions.cards.map(card => card.suit)).values()).sort()

  mapSuitToButton = (aidSelected: Deck, heroAction: Deck, heroActionSelected: Deck, suit: Suits): PlayButton => {
    const disablePlay = heroAction.length && !heroActionSelected.length;
    const aidSuit = aidSelected.peek()?.suit;
    const disableSuit = suit && aidSuit ? aidSuit !== suit : false;

    return {
      disabled: disablePlay || disableSuit,
      caption: `Play ${SuitLabels[suit]}`,
      suit,
    }
  }

  mapEmptyButtons = (heroAction: Deck, buttons: PlayButton[]): PlayButton[] => heroAction.length ? buttons : ([{ disabled: false, caption: 'Play' }]);

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

  showRevealOk$ = this.status$.pipe(
    map(status => status === GameStatus.ENEMY_REVEALED),
  );

  showSpend$ = combineLatest([this.eventCard$, this.status$]).pipe(
    map(([eventCard, status]) => status === GameStatus.CRAWL_ACT && eventCard?.suit !== 'coins'),
  );

  spendCaption$ = this.eventCard$.pipe(
    map(eventCard => eventCard?.suit === 'swords' ? 'Bribe' : 'Buy'),
  );

  constructor(
    private gameFacade: GameFacade,
  ) {}

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

  onKeep() {
    this.gameFacade.keepSelectedAction();
  }

  onRevealedOk() {
    this.gameFacade.revealedOk();
  }

  onSpend() {
    this.gameFacade.spend();
  }


}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameStatus } from '../+models/game.model';
import { Card } from '../+models/card.model';
import { Deck } from '../+models/deck.model';
import { GameFacade } from '../+state/game.facade';
import { combineLatest, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss'
})
export class ActionBarComponent {
  
  dice$ = this.gameFacade.dice$;

  goldSelected$ = this.gameFacade.goldSelectedDeck$;

  eventCard$ = this.gameFacade.eventCard$;
  
  status$ = this.gameFacade.status$;

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

  onSpend() {
    this.gameFacade.spend();
  }

}

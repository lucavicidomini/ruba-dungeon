import { Component, OnInit } from '@angular/core';
import { GameFacade } from '../+state/game.facade';
import { CommonModule } from '@angular/common';
import { DeckComponent } from '../deck/deck.component';
import { CardComponent } from '../card/card.component';
import { CharacterComponent } from '../character/character.component';
import { EnableIfStatusDirective } from '../directives/enable-if-status.directive';
import { GameStatus } from '../+models/game.model';
import { Card } from '../+models/card.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CharacterComponent,
    DeckComponent,
    EnableIfStatusDirective,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  GameStatus = GameStatus;

  aidDeck$ = this.gameFacade.aidDeck$;

  catacombDeck$ = this.gameFacade.catacombDeck$;

  characterDeck$ = this.gameFacade.characterDeck$;
  
  enemy$ = this.gameFacade.enemy$;

  eventCard$ = this.gameFacade.eventCard$;

  dungeonDeck$ = this.gameFacade.dungeonDeck$;

  goldDeck$ = this.gameFacade.goldDeck$;

  hero$ = this.gameFacade.hero$;

  relicDeck$ = this.gameFacade.relicDeck$;

  obtainedRelicDeck$ = this.gameFacade.obtainedRelicDeck$;
  
  status$ = this.gameFacade.status$;

  constructor(
    private gameFacade: GameFacade,
  ) {}

  ngOnInit(): void {
    this.gameFacade.start(); 
  }

  enableBribe(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && eventCard.suit !== 'coins';
  }

  enableCollect(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && eventCard.suit === 'coins';
  }

  enableCombat(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && eventCard.suit === 'swords';
  }

  enableDice(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && (eventCard.suit === 'clubs' || eventCard.suit === 'cups');
  }

  onBribe() {
    
  }

  onCollect() {
    this.gameFacade.collect();
  }

  onCombat() {

  }

  onDraw() {
    this.gameFacade.draw();
  }

  onDice() {

  }

}

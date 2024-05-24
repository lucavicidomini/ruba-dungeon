import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Card } from '../+models/card.model';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { CardComponent } from '../card/card.component';
import { CharacterComponent } from '../character/character.component';
import { DeckComponent } from '../deck/deck.component';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CharacterComponent,
    DeckComponent,
    SelectableDeckComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  GameStatus = GameStatus;

  aidDeck$ = this.gameFacade.aidDeck$;

  catacombDeck$ = this.gameFacade.catacombDeck$;

  characterDeck$ = this.gameFacade.characterDeck$;

  dice$ = this.gameFacade.dice$;
  
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

  enableDraw(status: GameStatus): boolean {
    return status === GameStatus.CRAWL_READY;
  }

  enableDice(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && (eventCard.suit === 'clubs' || eventCard.suit === 'cups');
  }

  enableDiceOk(status: GameStatus): boolean {
    return status === GameStatus.RESOLVE_THREW_DICE;
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
    this.gameFacade.throwDice();
  }

  onDiceOk() {
    this.gameFacade.resolveDice();
  }

}

import { Component, OnInit } from '@angular/core';
import { GameFacade } from '../+state/game.facade';
import { CommonModule } from '@angular/common';
import { DeckComponent } from '../deck/deck.component';
import { CardComponent } from '../card/card.component';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CharacterComponent,
    DeckComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

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

  onDraw() {
    this.gameFacade.draw();
  }

}

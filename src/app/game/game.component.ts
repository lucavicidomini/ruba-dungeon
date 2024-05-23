import { Component, OnInit } from '@angular/core';
import { GameFacade } from '../+state/game.facade';
import { CommonModule } from '@angular/common';
import { DeckComponent } from '../deck/deck.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    DeckComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  dungeonDeck$ = this.gameFacade.dungeonDeck$;

  status$ = this.gameFacade.status$;

  constructor(
    private gameFacade: GameFacade,
  ) {}

  ngOnInit(): void {
    this.gameFacade.start(); 
  }

}

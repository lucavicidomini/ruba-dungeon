import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { BoardComponent } from '../board/board.component';
import { PopupScreenComponent } from '../popup-screen/popup-screen.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    ActionBarComponent,
    BoardComponent,
    PopupScreenComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  GameStatus = GameStatus;

  error$ = this.gameFacade.error$;

  status$ = this.gameFacade.status$;

  constructor(
    private gameFacade: GameFacade,
  ) {}

  onNewGame() {
    this.gameFacade.start();
  }

}

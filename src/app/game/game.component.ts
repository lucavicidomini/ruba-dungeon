import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { BoardComponent } from '../board/board.component';
import { PopupScreenComponent } from '../welcome-popup/welcome-popup.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { map } from 'rxjs';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    ActionBarComponent,
    BoardComponent,
    MainMenuComponent,
    PopupComponent,
    PopupScreenComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  GameStatus = GameStatus;

  error$ = this.gameFacade.error$;

  status$ = this.gameFacade.status$;

  showWelcome$ = this.gameFacade.status$.pipe(
    map(status => [GameStatus.GAME_INIT, GameStatus.GAME_OVER, GameStatus.GAME_WON].includes(status)),
  )

  constructor(
    private gameFacade: GameFacade,
  ) {}

  onNewGame() {
    this.gameFacade.start();
  }

}

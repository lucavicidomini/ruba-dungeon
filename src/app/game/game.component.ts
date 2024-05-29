import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { BoardComponent } from '../board/board.component';
import { GameOverPopupComponent } from '../game-over-popup/game-over-popup.component';
import { GameWonPopupComponent } from '../game-won-popup/game-won-popup.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { PopupScreenComponent } from '../welcome-popup/welcome-popup.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    ActionBarComponent,
    BoardComponent,
    GameOverPopupComponent,
    GameWonPopupComponent,
    MainMenuComponent,
    PopupScreenComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  GameStatus = GameStatus;

  error$ = this.gameFacade.error$;

  status$ = this.gameFacade.status$;

  showGameOver$ = this.gameFacade.status$.pipe(
    map(status => status === GameStatus.GAME_OVER),
  );

  showGameWon$ = this.gameFacade.status$.pipe(
    map(status => status === GameStatus.GAME_WON),
  );

  showWelcome$ = this.gameFacade.status$.pipe(
    map(status => status === GameStatus.GAME_INIT),
  );

  constructor(
    private gameFacade: GameFacade,
  ) {}

  onNewGame() {
    this.gameFacade.start();
  }

}

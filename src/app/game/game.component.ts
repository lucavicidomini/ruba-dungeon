import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { MenuFacade } from '../+state/menu.facade';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { BoardComponent } from '../board/board.component';
import { GameOverPopupComponent } from '../game-over-popup/game-over-popup.component';
import { GameWonPopupComponent } from '../game-won-popup/game-won-popup.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { SettingsPopupComponent } from '../settings-popup/settings-popup.component';
import { AboutPopupComponent } from '../about-popup/about-popup.component';
import { NewGamePopupComponent } from '../new-game-popup/new-game-popup.component';
import { TutorialPopupComponent } from '../tutorial-popup/tutorial-popup.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    AboutPopupComponent,
    ActionBarComponent,
    BoardComponent,
    GameOverPopupComponent,
    GameWonPopupComponent,
    MainMenuComponent,
    NewGamePopupComponent,
    SettingsPopupComponent,
    TutorialPopupComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  GameStatus = GameStatus;

  layout$ = this.menuFacade.layout$;

  error$ = this.gameFacade.error$;

  status$ = this.gameFacade.status$;

  showAbout$ = this.menuFacade.about$;

  showGameOver$ = this.gameFacade.status$.pipe(
    map(status => status === GameStatus.GAME_OVER),
  );

  showGameWon$ = this.gameFacade.status$.pipe(
    map(status => status === GameStatus.GAME_WON),
  );

  showNewGame$ = this.menuFacade.newGame$;

  showSettings$ = this.menuFacade.settings$;

  constructor(
    private gameFacade: GameFacade,
    private menuFacade: MenuFacade,
  ) {}

  onNewGame() {
    this.gameFacade.start();
  }

}

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { MenuFacade } from '../+state/menu.facade';
import { PopupComponent } from '../popup/popup.component';
import { APP_VERSION } from '../version';
import { TutorialFacade } from '../+state/tutorial.facade';

@Component({
  selector: 'app-about-popup',
  standalone: true,
  imports: [AsyncPipe, PopupComponent],
  templateUrl: './about-popup.component.html',
  styleUrl: './about-popup.component.scss'
})
export class AboutPopupComponent {

  GameStatus = GameStatus;

  status$ = this.gameFacade.status$;

  version = APP_VERSION;

  constructor(
    private gameFacade: GameFacade,
    private menuFacade: MenuFacade,
    private tutorialFacade: TutorialFacade,
  ) {}

  onNewGame() {
    this.gameFacade.start();
  };

  onClose() {
    this.menuFacade.about(false);
  }

  onTutorial() {
    this.tutorialFacade.tutorialStart();
  }

}

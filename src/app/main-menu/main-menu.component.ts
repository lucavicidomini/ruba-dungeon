import { Component } from '@angular/core';
import { MenuFacade } from '../+state/menu.facade';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

  constructor(
    private menuFacade: MenuFacade,
  ) {}

  onNewGame() {
    this.menuFacade.newGame();
  }

  onSettings() {
    this.menuFacade.settings();
  }

  onAbout() {
    this.menuFacade.about();
  }

}

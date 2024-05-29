import { Component, EventEmitter, Output } from '@angular/core';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-game-won-popup',
  standalone: true,
  imports: [PopupComponent],
  templateUrl: './game-won-popup.component.html',
  styleUrl: './game-won-popup.component.scss'
})
export class GameWonPopupComponent {

  @Output() newGame = new EventEmitter<void>();

}

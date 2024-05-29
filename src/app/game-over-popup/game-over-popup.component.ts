import { Component, EventEmitter, Output } from '@angular/core';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-game-over-popup',
  standalone: true,
  imports: [PopupComponent],
  templateUrl: './game-over-popup.component.html',
  styleUrl: './game-over-popup.component.scss'
})
export class GameOverPopupComponent {

  @Output() newGame = new EventEmitter<void>();
  

}

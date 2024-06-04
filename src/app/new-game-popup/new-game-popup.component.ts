import { Component, EventEmitter, Output } from '@angular/core';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-new-game-popup',
  standalone: true,
  imports: [PopupComponent],
  templateUrl: './new-game-popup.component.html',
  styleUrl: './new-game-popup.component.scss'
})
export class NewGamePopupComponent {

  @Output() newGame = new EventEmitter<void>();

}

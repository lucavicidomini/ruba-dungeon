import { Component, EventEmitter, Output } from '@angular/core';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-welcome-popup',
  standalone: true,
  imports: [PopupComponent],
  templateUrl: './welcome-popup.component.html',
  styleUrl: './welcome-popup.component.scss'
})
export class WelcomePopupComponent {

  @Output() newGame = new EventEmitter<void>();

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameStatus } from '../+models/game.model';


@Component({
  selector: 'app-welcome-popup',
  standalone: true,
  imports: [],
  templateUrl: './welcome-popup.component.html',
  styleUrl: './welcome-popup.component.scss'
})
export class PopupScreenComponent {

  GameStatus = GameStatus;

  @Input() status?: GameStatus;

  @Output() newGame = new EventEmitter<void>();

}

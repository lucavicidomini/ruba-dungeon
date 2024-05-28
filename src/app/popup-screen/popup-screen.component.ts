import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameStatus } from '../+models/game.model';


@Component({
  selector: 'app-popup-screen',
  standalone: true,
  imports: [],
  templateUrl: './popup-screen.component.html',
  styleUrl: './popup-screen.component.scss'
})
export class PopupScreenComponent {

  GameStatus = GameStatus;

  @Input() status?: GameStatus;

  @Output() newGame = new EventEmitter<void>();

  get isVisible(): boolean {
    return !!this.status && [GameStatus.GAME_INIT, GameStatus.GAME_OVER, GameStatus.GAME_WON].includes(this.status);
  }
}

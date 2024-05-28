import { Component } from '@angular/core';
import { Card, Suits } from '../+models/card.model';
import { Deck } from '../+models/deck.model';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { CardComponent } from '../card/card.component';
import { CharacterComponent } from '../character/character.component';
import { DeckComponent } from '../deck/deck.component';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';
import { HeroActionDeckComponent } from '../hero-action-deck/hero-action-deck.component';
import { AidDeckComponent } from '../aid-deck/aid-deck.component';
import { Observable } from 'rxjs';
import { PopupScreenComponent } from '../popup-screen/popup-screen.component';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    BoardComponent,
    PopupScreenComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  GameStatus = GameStatus;

  error$ = this.gameFacade.error$;


  status$ = this.gameFacade.status$;

  constructor(
    private gameFacade: GameFacade,
  ) {
    this.gameFacade.start()
  }

  disablePlay(heroActions: Deck, heroActionSelected: Deck) {
    return heroActions.length && !heroActionSelected.length;
  }



  onNewGame() {
    this.gameFacade.start();
  }


  


  

}

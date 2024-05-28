import { Component, Input } from '@angular/core';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { DeckComponent } from '../deck/deck.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { CharacterComponent } from '../character/character.component';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';
import { Observable } from 'rxjs';
import { Deck } from '../+models/deck.model';
import { Suits } from '../+models/card.model';
import { HeroActionDeckComponent } from '../hero-action-deck/hero-action-deck.component';
import { AidDeckComponent } from '../aid-deck/aid-deck.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    ActionBarComponent,
    AidDeckComponent,
    CardComponent,
    CharacterComponent,
    DeckComponent,
    HeroActionDeckComponent,
    SelectableDeckComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  aidDeck$ = this.gameFacade.aidDeck$;

  aidSelectedDeck$ = this.gameFacade.aidSelectedDeck$;

  catacombDeck$ = this.gameFacade.catacombDeck$;

  combatAction$ = this.gameFacade.combatAction$;

  characterDeck$ = this.gameFacade.characterDeck$;

  dice$ = this.gameFacade.dice$;

  dungeonDeck$ = this.gameFacade.dungeonDeck$;
  
  enemy$ = this.gameFacade.enemy$;

  enemyActions$ = this.gameFacade.enemyAction$;

  eventDeck$ = this.gameFacade.eventDeck$;

  eventCard$ = this.gameFacade.eventCard$;

  goldDeck$ = this.gameFacade.goldDeck$;

  goldSelectedDeck$ = this.gameFacade.goldSelectedDeck$;

  hero$ = this.gameFacade.hero$;

  heroActions$ = this.gameFacade.heroAction$;
  
  heroActionSelectedDeck$ = this.gameFacade.heroActionSelectedDeck$;

  relicDeck$ = this.gameFacade.relicDeck$;

  obtainedRelicDeck$ = this.gameFacade.obtainedRelicDeck$;

  @Input() status!: GameStatus;
  
  constructor(
    private gameFacade: GameFacade,
  ) {}

  getHeroActionToDiscard(status: GameStatus): Observable<Deck> | undefined {
    return status === GameStatus.DISCARD_ACTION ? this.heroActions$ : undefined
  }

  getHeroActionToPlay(status: GameStatus): Observable<Deck> | undefined {
    return status !== GameStatus.DISCARD_ACTION ? this.heroActions$ : undefined
  }

  onAidSelect(aidSelected: Deck) {
    this.gameFacade.aidSelected(aidSelected);
  }

  onGoldSelect(goldSelected: Deck) {
    this.gameFacade.goldSelected(goldSelected);
  }

  onHeroActionSelect(heroActionSelected: Deck) {
    this.gameFacade.heroActionSelected(heroActionSelected);
  }

  onKeep() {
    this.gameFacade.keepSelectedAction();
  }

  onPlay(suit: Suits) {
    this.gameFacade.fight(suit);
  }

  onRevealedOk() {
    this.gameFacade.revealedOk();
  }

  showPlay(status: GameStatus): boolean {
    return status === GameStatus.COMBAT;
  }

  showRevealOk(status: GameStatus): boolean {
    return status === GameStatus.ENEMY_REVEALED;
  }

}

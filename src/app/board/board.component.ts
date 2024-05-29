import { Component, Input } from '@angular/core';
import { GameStatus } from '../+models/game.model';
import { GameFacade } from '../+state/game.facade';
import { DeckComponent } from '../deck/deck.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { CharacterComponent } from '../character/character.component';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';
import { Observable, combineLatest, map } from 'rxjs';
import { Deck } from '../+models/deck.model';
import { Suits } from '../+models/card.model';
import { HeroActionDeckComponent } from '../hero-action-deck/hero-action-deck.component';
import { AidDeckComponent } from '../aid-deck/aid-deck.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
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

  status$ = this.gameFacade.status$;

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

  heroActionToDiscard$ = combineLatest([this.status$, this.heroActions$]).pipe(
    map(([status, heroAction]) => status === GameStatus.DISCARD_ACTION ? heroAction : undefined)
  );
  
  heroActionToPlay$ = combineLatest([this.status$, this.heroActions$]).pipe(
    map(([status, heroAction]) => status !== GameStatus.DISCARD_ACTION ? heroAction : undefined),
  );
  
  heroActionSelectedDeck$ = this.gameFacade.heroActionSelectedDeck$;

  relicDeck$ = this.gameFacade.relicDeck$;

  obtainedRelicDeck$ = this.gameFacade.obtainedRelicDeck$;
  
  showPlay$ = this.status$.pipe(
    map(status => status === GameStatus.COMBAT),
  );

  constructor(
    private gameFacade: GameFacade,
  ) {}

  onAidSelect(aidSelected: Deck) {
    this.gameFacade.aidSelected(aidSelected);
  }

  onGoldSelect(goldSelected: Deck) {
    this.gameFacade.goldSelected(goldSelected);
  }

  onHeroActionSelect(heroActionSelected: Deck) {
    this.gameFacade.heroActionSelected(heroActionSelected);
  }



}

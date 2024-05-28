import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    AidDeckComponent,
    CardComponent,
    CharacterComponent,
    DeckComponent,
    HeroActionDeckComponent,
    PopupScreenComponent,
    SelectableDeckComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  GameStatus = GameStatus;

  aidDeck$ = this.gameFacade.aidDeck$;

  aidSelectedDeck$ = this.gameFacade.aidSelectedDeck$;

  catacombDeck$ = this.gameFacade.catacombDeck$;

  combatAction$ = this.gameFacade.combatAction$;

  characterDeck$ = this.gameFacade.characterDeck$;

  dice$ = this.gameFacade.dice$;

  dungeonDeck$ = this.gameFacade.dungeonDeck$;
  
  enemy$ = this.gameFacade.enemy$;

  enemyActions$ = this.gameFacade.enemyAction$;

  error$ = this.gameFacade.error$;

  eventDeck$ = this.gameFacade.eventDeck$;

  eventCard$ = this.gameFacade.eventCard$;

  goldDeck$ = this.gameFacade.goldDeck$;

  goldSelectedDeck$ = this.gameFacade.selectGoldSelectedDeck$;

  hero$ = this.gameFacade.hero$;

  heroActions$ = this.gameFacade.heroAction$;
  
  heroActionSelectedDeck$ = this.gameFacade.heroActionSelectedDeck$;

  relicDeck$ = this.gameFacade.relicDeck$;

  obtainedRelicDeck$ = this.gameFacade.obtainedRelicDeck$;
  
  status$ = this.gameFacade.status$;

  constructor(
    private gameFacade: GameFacade,
    private logger: LoggerService
  ) {}

  disablePlay(heroActions: Deck, heroActionSelected: Deck) {
    return heroActions.length && !heroActionSelected.length;
  }

  disableSpend(eventCard: Card, goldSelected: Deck) {
    return goldSelected.value < eventCard.value;
  }

  getHeroActionToPlay(status: GameStatus): Observable<Deck> | undefined {
    return status !== GameStatus.DISCARD_ACTION ? this.heroActions$ : undefined
  }

  getHeroActionToDiscard(status: GameStatus): Observable<Deck> | undefined {
    return status === GameStatus.DISCARD_ACTION ? this.heroActions$ : undefined
  }

  showCollect(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && eventCard.suit === 'coins';
  }

  showCombat(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && eventCard.suit === 'swords';
  }

  showDraw(status: GameStatus): boolean {
    return status === GameStatus.CRAWL_READY;
  }

  showDice(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && (eventCard.suit === 'clubs' || eventCard.suit === 'cups');
  }

  showDiceOk(status: GameStatus): boolean {
    return status === GameStatus.RESOLVE_THREW_DICE;
  }

  showPlay(status: GameStatus): boolean {
    return status === GameStatus.COMBAT;
  }

  showRevealOk(status: GameStatus): boolean {
    return status === GameStatus.ENEMY_REVEALED;
  }

  showSpend(status: GameStatus, eventCard: Card): boolean {
    return status === GameStatus.CRAWL_ACT && eventCard.suit !== 'coins';
  }

  onAidSelect(aidSelected: Deck) {
    this.gameFacade.aidSelected(aidSelected);
  }

  onCollect() {
    this.gameFacade.collect();
  }

  onCombat() {
    this.gameFacade.challenge();
  }

  onDraw() {
    this.gameFacade.draw();
  }

  onDice() {
    this.gameFacade.throwDice();
  }

  onDiceOk() {
    this.gameFacade.resolveCardByDice();
  }

  onKeep() {
    this.gameFacade.keepSelectedAction();
  }

  onNewGame() {
    this.gameFacade.start();
  }

  onPlay(suit: Suits) {
    this.gameFacade.fight(suit);
  }

  onGoldSelect(goldSelected: Deck) {
    this.gameFacade.goldSelected(goldSelected);
  }

  onHeroActionSelect(heroActionSelected: Deck) {
    this.gameFacade.heroActionSelected(heroActionSelected);
  }
  
  onRevealedOk() {
    this.gameFacade.revealedOk();
  }

  onSpend() {
    this.gameFacade.spend();
  }

}

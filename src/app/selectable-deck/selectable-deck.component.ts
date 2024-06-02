import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { CardComponent } from '../card/card.component';

import { BehaviorSubject, Subject, filter, fromEvent, map, merge, takeUntil, tap } from 'rxjs';
import { Card } from '../+models/card.model';

@Component({
  selector: 'app-selectable-deck',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './selectable-deck.component.html',
  styleUrl: './selectable-deck.component.scss'
})
export class SelectableDeckComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private shortcutKeys = '';

  @Input() deck = Deck.empty();

  @Input() set shortcuts(value: boolean | 'secondary' | null | undefined) {
    if (value === true) {
      this.shortcutKeys = '1234567890';
    } else if (value === 'secondary') {
      this.shortcutKeys = 'qwertyuiop';
    } else {
      this.shortcutKeys = '';
    }
  };

  @Input() selectedDeck = Deck.empty();

  @Output() selectCards = new EventEmitter<Deck>();

  showShortcuts = new BehaviorSubject(false);

  isSelected(card: Card): boolean {
    return this.selectedDeck.includes(card);
  }

  ngOnInit(): void {
    this.initShortcuts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggle(card: Card): void {
    const newSelectedDeck = this.selectedDeck.clone();

    if (this.isSelected(card)) {
      newSelectedDeck.remove(card);
    } else {
      newSelectedDeck.push(card);
    }

    this.selectCards.emit(newSelectedDeck);
  }

  initShortcuts() {
    const mapShortcut = (e: KeyboardEvent): number => {
      const key = e.key.toLocaleLowerCase();
      const regex = new RegExp(`^[${this.shortcutKeys}]$`);

      if (!regex.test(key)) {
        return -1;
      }

      return this.shortcutKeys.indexOf(key);
    }

    merge(
      fromEvent(document, 'keydown'),
      fromEvent(document, 'keyup'),
    ).pipe(
      takeUntil(this.destroy$),
      map(e => (e as KeyboardEvent).shiftKey),
      tap(showShortcuts => this.showShortcuts.next(showShortcuts)),
    ).subscribe();

    fromEvent(document, 'keydown').pipe(
      takeUntil(this.destroy$),
      filter(() => this.shortcutKeys.length > 0),
      map(e => mapShortcut(e as KeyboardEvent)),
      filter(index => index >= 0 && index < this.deck.length),
      tap(index => this.onToggle(this.deck.cards[index])),
    ).subscribe();
  }

  getShortcut(deck: Deck, card: Card): string {
    if (!this.showShortcuts.value) {
      return '';
    }
    const cardIndex = deck.cards.findIndex(inDeck => inDeck.equals(card));
    return (cardIndex >= 0 && cardIndex < this.shortcutKeys.length) ? this.shortcutKeys[cardIndex] : '';
  }

  get selectedCards(): Card[] {
    return this.selectedDeck?.cards ?? [];
  }

}

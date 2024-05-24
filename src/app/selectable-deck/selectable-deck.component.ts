import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { Card } from '../+models/card.model';

@Component({
  selector: 'app-selectable-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './selectable-deck.component.html',
  styleUrl: './selectable-deck.component.scss'
})
export class SelectableDeckComponent {

  @Input() deck = Deck.empty();

  @Input() selectedDeck: Deck | null = null;

  @Output() selectCard = new EventEmitter<Deck>();

  onToggle(card: Card) {

  }

  get selectedCards() {
    return this.selectedDeck?.cards ?? [];
  }

}

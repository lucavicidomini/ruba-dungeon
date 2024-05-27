import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { CommonModule } from '@angular/common';
import { SelectableDeckComponent } from '../selectable-deck/selectable-deck.component';

@Component({
  selector: 'app-aid-deck',
  standalone: true,
  imports: [CommonModule, SelectableDeckComponent],
  templateUrl: './aid-deck.component.html',
  styleUrl: './aid-deck.component.scss'
})
export class AidDeckComponent {

  @Input() deck: Deck = Deck.empty();

  @Input() selectedDeck: Deck = Deck.empty();

  @Output() selectCards = new EventEmitter<Deck>();

  onSelect(newSelection: Deck) {
    
    this.selectCards.emit(newSelection);
  }

}

import { Component, Input } from '@angular/core';
import { Deck } from '../+models/deck.model';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selectable-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './selectable-deck.component.html',
  styleUrl: './selectable-deck.component.scss'
})
export class SelectableDeckComponent {

  @Input() deck = Deck.empty();

}

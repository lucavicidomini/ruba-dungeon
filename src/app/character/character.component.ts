import { Component, Input } from '@angular/core';
import { Character } from '../+models/character.model';
import { CardComponent } from '../card/card.component';


@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {

  @Input() character?: Character;

}

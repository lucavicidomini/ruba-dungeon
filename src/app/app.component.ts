import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameFacade } from './+state/game.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'ruba-dungeon';

  constructor(
    private gameFacade: GameFacade,
  ) {}

  ngOnInit(): void {
     this.gameFacade.start(); 
  }
}

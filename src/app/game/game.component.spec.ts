import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { GameFacade } from '../+state/game.facade';
import { Store } from '@ngrx/store';

class GameFacadeMock {
    start() {}
}

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        { provide: GameFacade, useClass: GameFacadeMock },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

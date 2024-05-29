import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWonPopupComponent } from './game-won-popup.component';

describe('GameWonPopupComponent', () => {
  let component: GameWonPopupComponent;
  let fixture: ComponentFixture<GameWonPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameWonPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameWonPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroActionDeckComponent } from './hero-action-deck.component';

describe('HeroActionDeckComponent', () => {
  let component: HeroActionDeckComponent;
  let fixture: ComponentFixture<HeroActionDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroActionDeckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroActionDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

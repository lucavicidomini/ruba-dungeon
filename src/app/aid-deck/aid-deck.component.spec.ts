import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidDeckComponent } from './aid-deck.component';

describe('AidDeckComponent', () => {
  let component: AidDeckComponent;
  let fixture: ComponentFixture<AidDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AidDeckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AidDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

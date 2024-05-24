import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableDeckComponent } from './selectable-deck.component';

describe('SelectableDeckComponent', () => {
  let component: SelectableDeckComponent;
  let fixture: ComponentFixture<SelectableDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectableDeckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectableDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

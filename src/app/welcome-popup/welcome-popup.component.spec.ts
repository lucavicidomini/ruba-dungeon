import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupScreenComponent } from './welcome-popup.component';

describe('PopupScreenComponent', () => {
  let component: PopupScreenComponent;
  let fixture: ComponentFixture<PopupScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

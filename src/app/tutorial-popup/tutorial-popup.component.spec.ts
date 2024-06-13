import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialPopupComponent } from './tutorial-popup.component';

describe('TutorialPopupComponent', () => {
  let component: TutorialPopupComponent;
  let fixture: ComponentFixture<TutorialPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutorialPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

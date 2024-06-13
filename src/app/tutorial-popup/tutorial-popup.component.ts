import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TutorialFacade } from '../+state/tutorial.facade';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { map } from 'rxjs';

@Component({
  selector: 'app-tutorial-popup',
  standalone: true,
  imports: [AsyncPipe, DragDropModule],
  templateUrl: './tutorial-popup.component.html',
  styleUrl: './tutorial-popup.component.scss'
})
export class TutorialPopupComponent {
 
  confirmExit = false;

  step$ = this.tutorialFacade.step$;

  constructor(
    private tutorialFacade: TutorialFacade,
  ) {}

  onNext() {
    this.confirmExit = false;
    this.tutorialFacade.tutorialNext();
  }

  onExit() {
    this.confirmExit = true;
  }
  
  onExitConfirm() {
    this.confirmExit = false;
    this.tutorialFacade.tutorialExit();
  }

}

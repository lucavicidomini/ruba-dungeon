import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { TutorialFacade } from '../+state/tutorial.facade';

@Component({
  selector: 'app-tutorial-popup',
  standalone: true,
  imports: [AsyncPipe],
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

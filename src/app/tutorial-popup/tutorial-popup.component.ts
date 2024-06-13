import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TutorialFacade } from '../+state/tutorial.facade';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TutorialStep } from '../+models/tutorial.model';

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

  format(step: TutorialStep) {
    const { m } = step;
    const v = Array.isArray(m) ? m : [m];
    return v.map(line => {
      if (typeof line == 'object' && 'content' in line) {
        return `<p>${line.content}</p>`;
      }
      return `<p>${line}</p>`;
    }).join('');
  }

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

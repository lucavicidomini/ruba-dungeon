import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TutorialStep, tutorialSteps } from './+models/tutorial.model';
import { TutorialFacade } from './+state/tutorial.facade';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  private enableAutoClick = false;
  
  private constrainEl: HTMLElement | null = null;

  private resizeDebounce: number | null = null;

  private highlightId = 'tutorial-highlight';

  private highlightEl: HTMLElement | null = null;

  private highlightedEl: HTMLElement | null = null;

  private steps: TutorialStep[] = tutorialSteps;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private tutorialFacade: TutorialFacade,
  ) {

  }

  /**
   * Return a TutorialStep
   * @param index The 1-based tutorial step to retrieve
   */
  getStep(index: number | undefined): TutorialStep | undefined {
    return this.steps[(index ?? 0) - 1];
  }

  /**
   * Starts the tutorial
   */
  start() {
    // Create highlight element
    this.highlightEl = document.createElement('div');
    this.highlightEl.id = this.highlightId;
    document.body.append(this.highlightEl);

    // Add click listener
    this.document.addEventListener('click', this.clickListener, { capture: true });

    // Add resize listener
    addEventListener('resize', this.resizeListener);
  }

  /**
   * Reverts the effects made by starting the tutorial
   */
  stop() {
    // Disable click constraint and remove listener
    this.unconstrain();

    // Hide highlight element
    this.unhighlight();

    // Remove highlight element
    if (this.highlightEl) {
      this.document.body.removeChild(this.highlightEl)
      this.highlightEl = null;
    }

    // Remove resize listener
    removeEventListener('resize', this.resizeListener);

    console.log('TUT SEREVICE STOP')
  }

  /**
   * Disable clicks
   */
  constrain(step: TutorialStep | undefined): void {
    const selector = step?.e;
    if (selector) {
      window.setTimeout(() => this.constrainEl = this.selectElement(selector), 250);
    } else {
      this.constrainEl = null;
    }
  }

  unconstrain() {
    this.document.removeEventListener('click', this.clickListener, { capture: true });
    this.constrainEl = null;
  }

  highlight(step: TutorialStep | undefined): void {
    const selector = step?.h || step?.e;
    window.setTimeout(() => {
      this.highlightedEl = selector ? this.selectElement(selector) : null;
      this.updateHighlight();
    }, selector ? 250 : 0);
  }

  unhighlight() {
    this.highlightedEl = null;
    this.updateHighlight();
  }

  private updateHighlight() {
    if (!this.highlightEl) {
      return;
    }
    if (this.highlightedEl) {
      this.highlightEl.style.display = 'block';
      const bcr = this.highlightedEl.getBoundingClientRect();
      this.highlightEl.style.top = `${bcr.top}px`;
      this.highlightEl.style.left = `${bcr.left}px`;
      this.highlightEl.style.width = `${bcr.width}px`;
      this.highlightEl.style.height = `${bcr.height}px`;
    } else {
      this.highlightEl.style.display = 'none';
    }
  }

  // Note: use arrow function to `this` is bound to current TutorialService instance
  clickListener = (e: MouseEvent) => {
    let el: HTMLElement | null | undefined = e.target as HTMLElement;
    if (el.id.startsWith('tutorial-')) {
      return true;
    }

    while (el) {
      if (el === this.constrainEl) {
        this.tutorialFacade.tutorialNext();
        return true;
      }
      el = el.parentElement;
    }
    e.stopImmediatePropagation();
    return false;
  }

  resizeListener = () => {
    if (this.resizeDebounce) {
      clearTimeout(this.resizeDebounce);
    }
    this.resizeDebounce = window.setTimeout(() => this.updateHighlight(), 100);
  }
  
  autoClick(step: TutorialStep | undefined) {
    if (step?.autoclick !== undefined) {
      this.enableAutoClick = step.autoclick;
    }
    if (!this.enableAutoClick) {
      return;
    }
    setTimeout(() => {
      const el = this.constrainEl || this.document.getElementById('tutorial-next')
      if (step && el) {
        const e = new Event('click', { bubbles: true });
        el.dispatchEvent(e);
      }
    }, 300);
  }

  private selectElement(selector: string): HTMLElement | null {
    return this.document.querySelector(selector);
  }
   
}

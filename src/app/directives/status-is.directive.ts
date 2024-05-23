import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { GameFacade } from '../+state/game.facade';
import { GameStatus } from '../+models/game.model';
import { Subject, map, tap } from 'rxjs';

@Directive({
  selector: '[appStatusIs]',
  standalone: true
})
export class StatusIsDirective implements OnInit, OnDestroy {

  @Input() appStatusIs!: GameStatus;

  destroy$ = new Subject<void>();

  status$ = this.gameFacade.status$

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  ngOnInit(): void {
      this.status$.pipe(
        map(status => !this.appStatusIs || status == this.appStatusIs),
        tap(enabled => this.el.nativeElement.disabled = !enabled)
      ).subscribe();
  }

  constructor(
    private el: ElementRef,
    private gameFacade: GameFacade,
  ) {
    this.status$.subscribe(s => console.log(s))
  }

}

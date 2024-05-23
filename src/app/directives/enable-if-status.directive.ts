import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { GameFacade } from '../+state/game.facade';
import { GameStatus } from '../+models/game.model';
import { Subject, map, tap } from 'rxjs';

@Directive({
  selector: '[appEnableIfStatus]',
  standalone: true
})
export class EnableIfStatusDirective implements OnInit, OnDestroy {

  @Input() appEnableIfStatus!: GameStatus;

  destroy$ = new Subject<void>();

  status$ = this.gameFacade.status$

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  ngOnInit(): void {
      this.status$.pipe(
        map(status => !this.appEnableIfStatus || status == this.appEnableIfStatus),
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

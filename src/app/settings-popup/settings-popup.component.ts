import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MenuFacade } from '../+state/menu.facade';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-settings-popup',
  standalone: true,
  imports: [AsyncPipe, PopupComponent],
  templateUrl: './settings-popup.component.html',
  styleUrl: './settings-popup.component.scss'
})
export class SettingsPopupComponent {

  layout$ = this.menuFacade.layout$;

  constructor(
    private menuFacade: MenuFacade,
  ) {}

  onClose() {
    this.menuFacade.settings();
  }

  onLayout(layout: 'classic' | 'compact') {
    this.menuFacade.setLayout(layout);
  }

}

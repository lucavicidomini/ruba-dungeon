import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly KEY_SETTINGS = 'rb-settings';

  private settings = this.loadFromStorage();

  clearStorage() {
    localStorage.clear();
  }

  loadFromStorage(): Record<string, any> {
    const fromLocal = localStorage.getItem(this.KEY_SETTINGS);
    
    if (!fromLocal) {
      return {};
    }

    return JSON.parse(fromLocal);
  }

  saveToStorage() {
    localStorage.setItem(this.KEY_SETTINGS, JSON.stringify(this.settings));
  }

  load(key: string): any {
    return this.settings[key];
  }

  save(key: string, value: any) {
    if (this.settings[key] !== value) {
      this.settings[key] = value;
      this.saveToStorage();
    }
  }

}

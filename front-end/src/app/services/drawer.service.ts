import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  isOpen = false

  constructor() {
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

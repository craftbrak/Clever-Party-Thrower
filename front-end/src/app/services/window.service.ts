import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private isSmallScreen = new BehaviorSubject<boolean>(window.innerWidth < 768);

  constructor() {
  }

  checkScreenSize() {
    return this.isSmallScreen.asObservable();
  }

  onResize(size: number) {
    if (size < 768) {
      this.isSmallScreen.next(true);
    } else {
      this.isSmallScreen.next(false);
    }
  }
}

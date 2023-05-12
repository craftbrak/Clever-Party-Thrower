import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastSubject: Subject<string> = new Subject<string>();

  constructor() {
  }

  showToast(message: string) {
    console.log("showingToast")
    this.toastSubject.next(message);
  }
}

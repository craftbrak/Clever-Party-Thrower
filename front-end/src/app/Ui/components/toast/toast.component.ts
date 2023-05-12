import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast" [class.show]="show">
      <span>{{message}}</span>
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  @Input() message: string = '';
  show: boolean = false;

  constructor() {
  }

  showToast() {
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 2000);
  }

}

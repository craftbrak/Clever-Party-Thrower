import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ToastService} from "../../../../../services/toast.service";

@Component({
  selector: 'app-add-event-to-user-link-dialog',
  templateUrl: './add-event-to-user-link-dialog.component.html',
  styleUrls: ['./add-event-to-user-link-dialog.component.scss']
})
export class AddEventToUserLinkDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }, private toastService: ToastService) {
  }

  copyToClipboard(url: string) {
    navigator.clipboard.writeText(url);
    this.toastService.showToast('Copied to clipboard');
  }

}

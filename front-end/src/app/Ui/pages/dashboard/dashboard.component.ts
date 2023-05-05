import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EventFormComponent} from "../../components/event-form/event-form.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  showCreateEventForm = false;

  constructor(private dialog: MatDialog) {
  }

  openCreateEventForm() {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '75vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'submit') {
        // Refresh the dashboard data here
      }
    });
  }

  // openCreateEventForm() {
  //   this.showCreateEventForm = !this.showCreateEventForm;
  // }

}

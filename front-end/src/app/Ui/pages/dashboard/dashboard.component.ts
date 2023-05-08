import {ChangeDetectorRef, Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EventFormComponent} from "../../components/event-form/event-form.component";
import {EventService} from "../../../services/event.service";
import {AuthService} from "../../../auth/auth.service";
import {EventToUserData} from "../../components/event-info/event-info.component";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

export interface UserEvents {
  user: {
    eventToUsers: EventToUserData[];
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  showCreateEventForm = false;
  userEvents$: Observable<UserEvents | undefined>;
  eventId: string | null | undefined

  constructor(private dialog: MatDialog, private eventService: EventService, private authService: AuthService,
              private changeDetector: ChangeDetectorRef, private router: Router) {
    const email = this.authService.user?.email ?? "";
    this.userEvents$ = this.eventService.getUserEventData(email);
    this.eventService.selectedEventId$.subscribe(value => this.eventId = value)
  }

  openCreateEventForm() {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '75vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'submit') {
        this.eventService.getUserEventData(this.authService.user?.email ?? "")
      }
    });
  }

  linked = (id: string) => {
    this.eventService.updateEventId(id)
  }

}

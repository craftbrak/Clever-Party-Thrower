import {Component, OnInit} from '@angular/core';
import {EventService} from "../../../../services/event.service";
import {UserRole} from "../../../../entities/event-to-user.entity";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {
  AddEventToUserLinkDialogComponent
} from "./add-event-to-user-link-dialog/add-event-to-user-link-dialog.component";

export interface MemberData {
  id: string;
  role: UserRole;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  eventId: string | undefined | null
  memberData$: Observable<MemberData[]> | undefined

  constructor(private eventService: EventService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.eventService.selectedEventId$.subscribe(value => {
      this.eventId = value
      this.memberData$ = this.eventService.getEventUsers(this.eventId!)
    })

  }

  showDialog() {
    const dialogRef = this.dialog.open(AddEventToUserLinkDialogComponent, {
      data: {
        url: `https://${window.location.host}/login/${this.eventId}`
      },
      maxWidth: '80vw'
    });
  }
}

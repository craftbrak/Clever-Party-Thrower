import {Component, Input, OnInit} from '@angular/core';
import {UserRole} from "../../../entities/event-to-user.entity";
import {EventService} from "../../../services/event.service";
import {DomSanitizer} from "@angular/platform-browser";

export interface EventToUserData {
  id: string;
  role: UserRole;
  event: {
    id: string;
    name: string;
    selectedDate: {
      id: string;
      date: string;
    };
    availableDates: {
      id: string;
      date: string;
    }[];
    description: string;
    address: {
      city: string;
      country: {
        code: string;
      };
    };
    members: {
      id: string;
      role: UserRole;
      user: {
        id: string;
        name: string;
        avatar: string
      };
    }[];
  };
}

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent implements OnInit {
  @Input() eventData: EventToUserData | undefined;
  owner: any | undefined
  togglesDetails = false
  useravatar: string = ""

  constructor(private eventService: EventService, private sanitizer: DomSanitizer,) {
    this.eventService.selectedEventId$.subscribe(value => {
      if (value === this.eventData?.event?.id) {
        this.togglesDetails = true
      } else this.togglesDetails = false
    })
  }

  @Input() cliked: (eventId: string, eventToUserId: string) => void = () => {
  }

  ngOnInit(): void {
    this.owner = this.eventData?.event.members.find(member => member.role === UserRole.OWNER)?.user
    this.useravatar = <string>this.sanitizer.bypassSecurityTrustUrl(<string>this.owner?.avatar)
  }

  onlinkclick(id: string, eventToUserId: string) {
    this.cliked(id, eventToUserId)
  }
}

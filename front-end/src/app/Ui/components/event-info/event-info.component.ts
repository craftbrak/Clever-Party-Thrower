import {Component, Input, OnInit} from '@angular/core';
import {UserRole} from "../../../entities/event-to-user.entity";
import {EventService} from "../../../services/event.service";

export interface EventToUserData {
  id: string;
  role: UserRole;
  event: {
    id: string;
    name: string;
    selectedDate: {
      date: string;
    };
    availableDates: {
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

  constructor(private eventService: EventService) {
    this.eventService.selectedEventId$.subscribe(value => {
      if (value === this.eventData?.event?.id) {
        this.togglesDetails = true
      } else this.togglesDetails = false
    })
  }

  @Input() cliked: (id: string) => void = () => {
  }

  ngOnInit(): void {
    this.owner = this.eventData?.event.members.find(m => {
      m.role == UserRole.OWNER
    })?.user
    console.log(this.eventData?.event.members)
    console.log(this.owner)
  }

  onlinkclick(id: string) {
    this.cliked(id)
  }
}

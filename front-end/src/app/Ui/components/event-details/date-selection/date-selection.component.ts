import {Component, Input} from '@angular/core';
import {EventService} from "../../../../services/event.service";
import {Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AddDateDialogComponent} from "./add-date-dialog/add-date-dialog.component";
import {AuthService} from "../../../../auth/auth.service";
import {isLetter} from "graphql/language/characterClasses";

@Component({
  selector: 'app-date-selection',
  templateUrl: './date-selection.component.html',
  styleUrls: ['./date-selection.component.scss']
})
export class DateSelectionComponent {
  @Input() eventId: string | undefined | null
  @Input() eventToUserID: string | undefined
  eventDates$: Observable<Event_requestData>;
  @Input() isOwner: boolean = false;
  selectDate: boolean = false
  showAvailableDates: boolean = true
  selectForm: FormGroup;
  protected readonly isLetter = isLetter;
  private eventDates: Event_requestData | undefined
  private dataRefreshTrigger$: Subject<void>;

  constructor(private authService: AuthService, public dialog: MatDialog, private eventService: EventService, private formBuilder: FormBuilder) {
    this.dataRefreshTrigger$ = new Subject<void>();
    this.eventDates$ = this.dataRefreshTrigger$.pipe(
      startWith(null), // Trigger the initial data load
      switchMap(() => {
        return this.eventService.getEventDatesData(this.eventId!)
      }),
      tap(value => {
        this.eventDates = value
        if (this.eventDates.fixedDate) {
          this.showAvailableDates = false
        }
      })
    );
    this.eventService.eventToUserId$.subscribe(value => {
      this.eventToUserID = value!
      this.dataRefreshTrigger$.next()
    })
    this.eventService.selectedEventId$.subscribe(value => this.eventId = value!)
    this.selectForm = this.formBuilder.group({
      option: ""
    })
  }

  voteForDate(id: string) {
    if (this.eventDates?.availableDates.length !== 0) {
      const date = this.eventDates!!.availableDates.find(value => value.id === id)
      if (!this.hasVoted(date!)) {
        console.log("peux voter")
        this.eventService.voteForDate(date?.id!, this.eventToUserID!, 1, date?.numberVotes!).subscribe(() => {
          this.dataRefreshTrigger$.next()
        })
      } else {
        console.log('already a vote for this date')
      }
    }
  }

  removeVote(id: string) {
    const date = this.eventDates!!.availableDates.find(value => value.id === id)
    const dtu = date?.datesToUsers.find(value => value.eventToUser.user.id === this.authService.user?.id)
    this.eventService.removeVoteForDate(dtu!.id, date!.id, date!.numberVotes - 1).subscribe(() => {
      this.dataRefreshTrigger$.next()
      console.log("deleted")
    })
  }

  hasVoted(date: EventDate_requestData): boolean {
    return (date?.datesToUsers.find(value => value.eventToUser.user.id === this.authService.user?.id) !== undefined)
  }

  addDate() {
    const dialogRef = this.dialog.open(AddDateDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.AddEventDate(this.eventId!, result).subscribe(() => this.dataRefreshTrigger$.next())
      }
    });
  }

  toggleSelectionInterface() {
    this.selectDate = !this.selectDate
    if (this.eventDates?.fixedDate) {
      this.showAvailableDates = !this.showAvailableDates
    }
  }

  submitSelectionForm() {
    if (this.selectForm.valid) {
      const value = this.selectForm.get("option")?.value
      this.eventService.UpdateSelectedDate(this.eventId!, value).subscribe(() => this.dataRefreshTrigger$.next())
      this.toggleSelectionInterface()
    }
  }
}


export interface User_requestData {
  avatar: string;
  name: string;
  id: string;
}

export interface EventToUser_requestData {
  role: string;
  user: User_requestData;
  id: string;
}

export interface DatesToUser_requestData {
  voteValue: number;
  eventToUser: EventToUser_requestData;
  id: string;
}

export interface EventDate_requestData {
  id: string;
  date: string;
  datesToUsers: DatesToUser_requestData[];
  numberVotes: number;
}

export interface Event_requestData {
  id: string;
  selectedDate: EventDate_requestData;
  fixedDate: boolean;
  availableDates: EventDate_requestData[];
}

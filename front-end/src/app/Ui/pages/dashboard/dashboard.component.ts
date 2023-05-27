import {ChangeDetectorRef, Component, HostListener, OnDestroy} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EventFormComponent} from "../../components/event-form/event-form.component";
import {EventService} from "../../../services/event.service";
import {AuthService} from "../../../auth/auth.service";
import {EventToUserData} from "../../components/event-info/event-info.component";
import {Observable, startWith, Subject, Subscription, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {DrawerService} from "../../../services/drawer.service";
import {WindowService} from "../../../services/window.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserSettingsComponent} from "../../components/user-settings/user-settings.component";

export interface UserEvents {
  user: {
    eventToUsers: EventToUserData[];
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('drawerAnimation', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(-100%)'}))
      ])
    ])]
})
export class DashboardComponent implements OnDestroy {

  showCreateEventForm = false;
  userEvents$: Observable<UserEvents | undefined>;
  eventId: string | null | undefined
  private dataRefreshTrigger$: Subject<void>;
  private readonly eventIdSubscription: Subscription;

  constructor(public windowService: WindowService, public drawerService: DrawerService, public dialog: MatDialog, private eventService: EventService, private authService: AuthService,
              private changeDetector: ChangeDetectorRef, private router: Router) {
    const email = this.authService.user?.email ?? "";
    this.eventIdSubscription = this.eventService.selectedEventId$.subscribe(value => this.eventId = value)

    this.dataRefreshTrigger$ = new Subject<void>();

    this.userEvents$ = this.dataRefreshTrigger$.pipe(
      startWith(null), // Trigger the initial data load
      switchMap(() => {
        return this.eventService.getUserEventData(email)
      })
    );
  }

  openCreateEventForm() {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '75vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'submit') {
        this.refreshData();
        // console.log('refreshingData')
      }
    });
  }

  linked = (eventId: string, eventToUserId: string) => {
    this.eventService.updateEventId(eventId)
    this.eventService.updateEventToUserId(eventToUserId)
  }

  ngOnDestroy() {
    if (this.eventIdSubscription) {
      this.eventIdSubscription.unsubscribe();
    }
  }

  refreshData() {
    this.dataRefreshTrigger$.next();
  }

  menuOpen() {
    console.log('menuOpened')
  }

  logout() {
    this.authService.logout()
  }

  userSettings() {
    const dialogRef = this.dialog.open(UserSettingsComponent, {
      width: '80%',
      data: this.authService.user
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      window.location.reload()
      // Update the user data with the form result here
    });
  }

  toggleMenu() {
    this.drawerService.toggle();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    this.windowService.onResize(event.target.innerWidth);
  }

  showEventList() {


    // if (this.eventId){
    //   return this.drawerService.isOpen;
    // }else return false
    return this.eventId ? this.drawerService.isOpen : false
  }
}

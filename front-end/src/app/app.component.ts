import {Component, OnInit} from '@angular/core';
import {timer} from "rxjs";
import {AuthService} from "./auth/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Clever Party Thrower';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.scheduleTokenRefresh()
  }

  scheduleTokenRefresh() {
    const expiresIn = 400000;
    const refreshBuffer = 1;

    timer(expiresIn - refreshBuffer)
      .subscribe(async () => {
        await this.authService.refreshTokens();
        this.scheduleTokenRefresh() // Schedule the next refresh
      });
  }
}

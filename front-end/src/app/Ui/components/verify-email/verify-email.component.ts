import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  verified: boolean | null = null
  private token: string | null = null

  constructor(private authService: AuthService, private router: Router,
              private route: ActivatedRoute,) {
    this.verified = this.authService.user?.isVerified!
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
    });
    if (this.authService.user?.isVerified && this.token) {
      this.authService.verifyUser(this.token).subscribe(value => console.log(value))
    }
  }

}

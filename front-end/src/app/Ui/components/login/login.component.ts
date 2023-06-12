import {AuthService, LoginResults} from '../../../auth/auth.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  totp: string = '';
  loginForm: FormGroup;
  TotpInValid = false
  CredentialsInValid = false
  eventId: string | null | undefined;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private eventService: EventService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      totp: [''],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.TotpInValid = false

    const {email, password, totp} = this.loginForm.value;

    this.authService.login(email, password, totp).subscribe(
      (result) => {
        switch (result) {
          case LoginResults.ok:
            if (this.eventId) {
              this.eventService.addEventToUser(this.eventId, this.authService.user?.id!).subscribe(value => {
                this.router.navigate(['/dashboard'])
              })
            } else {
              this.router.navigate(['/dashboard'])
            }
            break;
          case LoginResults.invalidCredentials:
            this.CredentialsInValid = true
            break;
          case LoginResults.invalidTotp:
            this.TotpInValid = true
            break;
        }
      },
      (error) => {
        // Handle any errors from the API
        console.error('Login error:', error);
      }
    );
  }


  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.CredentialsInValid = false

    })
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId');
    });
  }

  redirectToRegister() {
    this.router.navigate(['/register', this.eventId ?? ''])
  }

  redirectToPasswordReset() {
    this.router.navigate(['/request_reset_password'])
  }
}

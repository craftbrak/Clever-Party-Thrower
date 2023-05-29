import {AuthService} from '../../../auth/auth.service';
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
  loginForm: FormGroup;
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
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const {email, password} = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      (value) => {
        if (value) {
          if (this.eventId) {
            this.eventService.addEventToUser(this.eventId, this.authService.user?.id!).subscribe(value => {
              this.router.navigate(['/dashboard'])
            })
          } else {
            this.router.navigate(['/dashboard'])
          }
        } else {
          this.CredentialsInValid = true
        }
        // Redirect to a protected route or the dashboard after successful login
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
    this.router.navigate(['/register', this.eventId])
  }

  redirectToPasswordReset() {
    this.router.navigate(['/request_reset_password'])
  }
}

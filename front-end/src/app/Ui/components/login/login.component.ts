import {AuthService} from '../../../auth/auth.service';
import {Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
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
        value ? this.router.navigate(['/dashboard']) : this.CredentialsInValid = true;
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
  }
}

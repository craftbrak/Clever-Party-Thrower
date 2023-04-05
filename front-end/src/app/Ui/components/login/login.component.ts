import {AuthService} from '../../../auth/auth.service';
import {Router} from "@angular/router";
import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginForm: FormGroup;

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
      () => {
        // Redirect to a protected route or the dashboard after successful login
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Handle any errors from the API
        console.error('Login error:', error);
      }
    );
  }
}

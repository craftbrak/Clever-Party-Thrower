import {AuthService} from '../../auth.service';
import {Router} from "@angular/router";
import {Component} from "@angular/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit(): void {
    this.authService
      .login(this.email, this.password)
      .subscribe(
        () => {
          this.router.navigate(['/dashboard']); // Replace '/protected-route' with the path to your desired route
          //todo: Redirect to a protected route or show a success message
        },
        (error) => {
          //todo: Handle errors, e.g., show an error message
        }
      );
  }
}

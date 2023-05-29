import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup | undefined;
  token: string | null = null;
  invalidToken = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  onSubmit(): void {
    if (this.resetPasswordForm?.valid) {
      const password = this.resetPasswordForm?.get('password')?.value;
      // Implement password reset logic here
      this.authService.resetPw(this.token!, password).subscribe(value => {
        if (value) {
          this.router.navigate(['/dashboard'])
        } else {
          this.invalidToken = true
        }
        console.log(value)
      })
      // console.log('Password:', password);
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({passwordMismatch: true});
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

}

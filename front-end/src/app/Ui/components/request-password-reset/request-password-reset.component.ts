import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss']
})
export class RequestPasswordResetComponent implements OnInit {

  requestResetForm: FormGroup | undefined;
  showtooltipMessage = false

  constructor(private formBuilder: FormBuilder, private authService: AuthService,) {
  }

  ngOnInit(): void {
    this.requestResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.requestResetForm?.valid) {
      const email = this.requestResetForm?.get('email')?.value;
      this.authService.requestPasswordRest(email).subscribe(value => {
        if (value) {
          this.showtooltipMessage = true
        }
      })
      console.log('Email:', email);
    }
  }
}

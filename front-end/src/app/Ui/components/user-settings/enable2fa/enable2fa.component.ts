import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-enable2fa',
  templateUrl: './enable2fa.component.html',
  styleUrls: ['./enable2fa.component.scss']
})
export class Enable2faComponent implements OnInit {

  isScanned = false;
  isVerified = false;
  secretUrl: string | undefined;
  verificationForm: FormGroup | undefined;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.verificationForm = this.formBuilder.group({
      verificationCode: ['', [Validators.required]]
    });

    this.authService.enable2faStep1().subscribe((data: any) => {
      // Assuming that your backend returns an object with otpauth as a property
      this.secretUrl = data;
      console.log(data)
    });
  }

  onSubmit() {
    // Simulate verifying with the backend
    this.authService.enable2faStep2(this.verificationForm?.value.verificationCode)
      .subscribe((data: any) => {
        console.log(data)
        if (data.status === 'success') {
          this.isVerified = true;
        }
      });
  }

  finish() {
    this.router.navigate(["/"])
  }

  onScan() {
    this.isScanned = true;
  }


}

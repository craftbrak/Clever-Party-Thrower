import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordMatchDirective} from "../../../../auth/password-match.directive";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: ['./user-info-form.component.scss']
})
export class UserInfoFormComponent implements OnInit {
  @Output() valid = new EventEmitter<boolean>();
  @Output() userInfo = new EventEmitter<any>();
  @Output() userName = new EventEmitter<string>();

  userInfoForm: FormGroup;
  showDetails: boolean = false;

  minPassLenthg = 10

  constructor(private formBuilder: FormBuilder) {
    this.userInfoForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.minPassLenthg),]],//PasswordMatchDirective.passwordMatch('password', "confirmPassword")
      confirmPassword: ['', Validators.required, PasswordMatchDirective.passwordMatch('password', "confirmPassword")]
    });
  }

  get password() {
    return this.userInfoForm.get('password')
  }

  get email() {
    return this.userInfoForm.get('email')
  }

  get confirmPassword() {
    return this.userInfoForm.get('confirmPassword')
  }

  get name() {
    return this.userInfoForm.get('name')
  }

  ngOnInit(): void {
    this.userInfoForm.statusChanges.subscribe(status => {
      this.valid.emit(status === 'VALID');
    });
    this.name?.valueChanges.pipe(debounceTime(400)).subscribe(value => {
      this.userName.emit(value)
    })
    this.userInfoForm.valueChanges.pipe(debounceTime(450)).subscribe(value => this.userInfo.emit(value))

  }

  onSubmit(): void {
    if (this.userInfoForm.valid) {
      this.userInfo.emit(this.userInfoForm.value);
    }
  }
}

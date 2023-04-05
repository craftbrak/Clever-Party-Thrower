import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../../auth/auth.service";
import {Country} from "../../../entities/address.entity";
import {AddressService} from "../../../services/address.service";
import {debounceTime} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {PasswordMatchDirective} from "../../../auth/password-match.directive";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({opacity: 0})),
      transition('void <=> *', animate('300ms ease-in')),
    ]),
  ],
})
export class RegisterComponent implements OnInit {
  isLinear = false;

  step1FormGroup: FormGroup
  step2FormGroup: FormGroup
  step3FormGroup: FormGroup
  step4FormGroup: FormGroup
  countries: Country[] = [];
  avatarUrls: string[] = [];
  avatarTypesUrls: string[] = ["https://api.dicebear.com/6.x/adventurer/svg?seed=", "https://api.dicebear.com/6.x/big-smile/svg?seed=", "https://api.dicebear.com/6.x/bottts/svg?seed=", "https://api.dicebear.com/6.x/pixel-art/svg?seed=", "https://api.dicebear.com/6.x/personas/svg?seed=",];//"https://api.dicebear.com/6.x/initials/svg?seed="
  showDetails: boolean = false;

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private addressService: AddressService) {
    this.step1FormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      confirmPassword: ['', Validators.required, PasswordMatchDirective.passwordMatch('password', "confirmPassword")]
    });


    this.step2FormGroup = this.formBuilder.group({
      streetNumber: ['', Validators.required],
      unitNumber: [''],
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      countryId: ['', Validators.required]
    });

    this.step3FormGroup = this.formBuilder.group({
      drivingLicence: [false],
      manual: [false]
    });

    this.step4FormGroup = this.formBuilder.group({
      avatar: ['', Validators.required]
    });
  }

  get password() {
    return this.step1FormGroup.get('password');
  }

  ngOnInit(): void {

    this.step1FormGroup.controls['name'].valueChanges.pipe(debounceTime(45)).subscribe(name => this.querryAvatars(name))
  }

  querryAvatars(name: string) {
    this.avatarUrls = []
    this.avatarTypesUrls.forEach(url => {
      this.avatarUrls.push(url + name);
    })
  }

  onSubmit() {

  }

  onStrengthChanged(strength: number) {
    console.log('password strength = ', strength);
  }

  private registerUser(name: string, email: string, password: string, addressId: string, licence: boolean, manual: boolean, avatar: string) {
    console.log("Creating User")
    this.authService.register(name, email, password, licence, manual, addressId, avatar).subscribe(reps => {
      this.router.navigate(['/dashboard']);
    }, error => {
      console.error('Registering error:', error);
    })
  }
}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-driving-licence-form',
  templateUrl: './driving-licence-form.component.html',
  styleUrls: ['./driving-licence-form.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({opacity: 0})),
      transition('void <=> *', animate('300ms ease-in')),
    ]),
  ]
})
export class DrivingLicenceFormComponent implements OnInit {
  @Output() valid = new EventEmitter<boolean>();
  @Output() licence = new EventEmitter<any>();

  drivingLicenceForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.drivingLicenceForm = this.formBuilder.group({
      drivingLicence: [false],
      manual: [false]
    });
  }

  ngOnInit(): void {
    this.drivingLicenceForm.statusChanges.subscribe(status => {
      this.valid.emit(status === 'VALID');
    });
    this.drivingLicenceForm.valueChanges.pipe(debounceTime(450)).subscribe(value => this.licence.emit(value))
  }

  onSubmit(): void {
    if (this.drivingLicenceForm.valid) {
      this.licence.emit(this.drivingLicenceForm.value);
    }
  }
}

import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-event-info-form',
  templateUrl: './event-info-form.component.html',
  styleUrls: ['./event-info-form.component.scss']
})
export class EventInfoFormComponent {
  eventInfoForm: FormGroup;

  @Output() valid = new EventEmitter<boolean>();
  @Output() eventInfo = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.eventInfoForm = this.fb.group({
      eventName: ['', Validators.required],
      eventDescription: [''],
    });

    this.eventInfoForm.valueChanges.subscribe((value) => {
      this.valid.emit(this.eventInfoForm.valid);
      this.eventInfo.emit(value);
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatRadioChange} from '@angular/material/radio';
import {MatStepper} from '@angular/material/stepper';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  eventForm: FormGroup;
  isLinear = false;
  protected readonly FormGroup = FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      addressType: ['', Validators.required],
      newAddress: this.fb.group({
        // Add form controls for new address fields here
      }),
    });
  }

  ngOnInit(): void {
  }

  onAddressTypeChange(stepper: MatStepper, event: MatRadioChange): void {
    if (event.value === 'new') {
      this.eventForm.get('newAddress')?.enable();
    } else {
      this.eventForm.get('newAddress')?.disable();
    }
    stepper.next();
  }

  onSubmit(): void {
    // Handle form submission logic here
  }
}

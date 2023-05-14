import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BootSizes, Fuels} from "../../../../../entities/car.entity";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-car-form',
  templateUrl: './create-car-form.component.html',
  styleUrls: ['./create-car-form.component.scss']
})
export class CreateCarFormComponent {
  carForm: FormGroup;
  fuels = Object.values(Fuels);
  bootSizes = Object.values(BootSizes);

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<CreateCarFormComponent>) {

    this.carForm = this.formBuilder.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      maxPassengers: ['', Validators.required],
      consumption: ['', Validators.required],
      bootSize: ['', Validators.required],
      fuel: ['', Validators.required],
      manualTransmission: ['', Validators.required],
      range: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.carForm.valid) {
      const createCarDto = this.carForm.value;
      this.dialogRef.close(createCarDto);
    }
  }
}

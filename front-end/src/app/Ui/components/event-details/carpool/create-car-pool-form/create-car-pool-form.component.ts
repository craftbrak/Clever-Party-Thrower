import {Component, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {CarpoolService} from "../../../../../services/carpool.service";

@Component({
  selector: 'app-create-car-pool-form',
  templateUrl: './create-car-pool-form.component.html',
  styleUrls: ['./create-car-pool-form.component.scss']
})
export class CreateCarPoolFormComponent {
  carpoolForm: FormGroup
  carForm: FormGroup;
  locationForm: FormGroup;
  detailsForm: FormGroup;

  constructor(private formBuilder: FormBuilder, @Optional() private dialogRef: MatDialogRef<CreateCarPoolFormComponent>, public carpoolService: CarpoolService) {
    this.carForm = this.formBuilder.group({
      selectedCar: ['', Validators.required]
    });

    this.locationForm = this.formBuilder.group({
      address: ['', Validators.required]
    });

    this.detailsForm = this.formBuilder.group({
      direction: ['', Validators.required],
      driver: ['Default Driver Name', Validators.required],
      departure: ['', Validators.required],
      arrival: ['', Validators.required]
    });

    this.carpoolForm = this.formBuilder.group({
      car: this.carForm,
      location: this.locationForm,
      details: this.detailsForm
    });
  }

  onSubmit() {
    if (this.carpoolForm.valid) {
      const createCarpoolDto = this.carpoolForm.value
      this.dialogRef?.close(createCarpoolDto)
    }
  }

  openCarModal() {

  }
}

import {Component} from '@angular/core';
import {CreateCarFormComponent} from "./create-car-form/create-car-form.component";
import {MatDialog} from "@angular/material/dialog";
import {CarpoolService, CreateCarInput} from "../../../../services/carpool.service";

@Component({
  selector: 'app-carpool',
  templateUrl: './carpool.component.html',
  styleUrls: ['./carpool.component.scss']
})
export class CarpoolComponent {

  constructor(private dialog: MatDialog, private carpoolService: CarpoolService) {
  }

  openCreateCarDialog() {
    const dialogRef = this.dialog.open(CreateCarFormComponent, {});

    dialogRef.afterClosed().subscribe((result: CreateCarInput) => {
      if (result) {
        console.log(result)
        this.carpoolService.addCar(result)
        // Faites quelque chose avec le DTO de la voiture créée
      }
    });
  }
}

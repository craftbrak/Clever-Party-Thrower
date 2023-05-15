import {Component} from '@angular/core';
import {CreateCarFormComponent} from "./create-car-form/create-car-form.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-carpool',
  templateUrl: './carpool.component.html',
  styleUrls: ['./carpool.component.scss']
})
export class CarpoolComponent {

  constructor(private dialog: MatDialog) {
  }

  openCreateCarDialog() {
    const dialogRef = this.dialog.open(CreateCarFormComponent, {});

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Faites quelque chose avec le DTO de la voiture créée
      }
    });
  }
}

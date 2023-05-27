import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CarpoolComponent} from './carpool.component';
import {CarpoolService} from "../../../../services/carpool.service";
import {CreateCarFormComponent} from "./create-car-form/create-car-form.component";
import {CreateCarPoolFormComponent} from "./create-car-pool-form/create-car-pool-form.component";
import {of} from 'rxjs';

describe('CarpoolComponent', () => {
  let component: CarpoolComponent;
  let fixture: ComponentFixture<CarpoolComponent>;
  let dialog: MatDialog;
  let carpoolService: CarpoolService;
  let dialogRefSpyObj = jasmine.createSpyObj({afterClosed: of({}), close: null});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarpoolComponent],
      imports: [MatDialogModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpyObj},
        {provide: CarpoolService, useValue: {addCar: jasmine.createSpy('addCar')}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarpoolComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    carpoolService = TestBed.inject(CarpoolService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open create car dialog', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.openCreateCarDialog();
    expect(dialog.open).toHaveBeenCalledWith(CreateCarFormComponent, {});
  });

  it('should open create carpool dialog', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.openCreateCarpoolDialog();
    expect(dialog.open).toHaveBeenCalledWith(CreateCarPoolFormComponent, {});
  });

  it('should call addCar in CarpoolService when dialog closes with result', () => {
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.openCreateCarDialog();
    expect(carpoolService.addCar).toHaveBeenCalled();
  });

});

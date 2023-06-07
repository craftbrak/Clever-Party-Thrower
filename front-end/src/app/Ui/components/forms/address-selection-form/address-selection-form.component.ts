import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Address} from "../../../../entities/address.entity";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {AddressService} from "../../../../services/address.service";
import {AuthService} from "../../../../auth/auth.service";
import {Observable, startWith, Subject, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-address-selection-form',
  templateUrl: './address-selection-form.component.html',
  styleUrls: ['./address-selection-form.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({height: 0, opacity: 0}),
        animate('0.3s ease-in-out', style({height: '*', opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.3s ease-in-out', style({height: 0, opacity: 0}))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* <=> *', [
        query(':enter, :leave', [
          stagger(300, [
            animate('0.3s', style({height: 0, opacity: 0}))
          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class AddressSelectionFormComponent implements OnInit, OnDestroy, OnChanges {
  // @Input() addresses: Address[] = [];
  address$: Observable<Address[]>
  addressRefreshTrigger$: Subject<void>
  @Output() valid = new EventEmitter<boolean>();
  @Output() selectedAddress = new EventEmitter<Address>();
  @Output() addNewAddress = new EventEmitter<void>();
  @Input() addressId ?: string = ''
  addressSelectionForm: FormGroup;
  selectedAddressId: string = '';
  showAddAddressForm = false;
  addressCreateValid = false;
  cols: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private addressess: Address[] | undefined;

  constructor(private fb: FormBuilder, private addressService: AddressService, private authService: AuthService) {
    this.addressSelectionForm = this.fb.group({
      addressId: ['', Validators.required],
    });
    this.addressRefreshTrigger$ = new Subject<void>();

    this.address$ = this.addressRefreshTrigger$.pipe(
      startWith(null),
      switchMap(() => {
        return this.addressService.getAddresses()
      }),
      tap(addresses => {
        this.addressess = addresses; // This is your local component variable
      })
    )
    this.addressSelectionForm.valueChanges.subscribe((value) => {
      // console.log(value.addressId)
      const a = this.addressess?.find(a => a.id === value.addressId)
      console.log(a)
      this.selectedAddress.emit(a);
      this.valid.emit(this.addressSelectionForm.valid);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["addressId"] && this.addressId) {
      // this.addressSelectionForm.get("addressId")?.patchValue(this.addressId)
      // this.selectedAddressId = this.addressId!
    }
  }

  ngOnInit() {
    this.updateCols(window.innerWidth);
    this.resizeObserver = new ResizeObserver(entries => {
      if (entries.length > 0) {
        const width = entries[0].contentRect.width;
        this.updateCols(width);
      }
    });
    this.addressSelectionForm.get("addressId")?.patchValue(this.addressId)
    this.selectedAddressId = this.addressId!
    this.resizeObserver.observe(document.body);
    // if (this.addresses.length > 0) {
    //   this.selectedAddressId = this.addresses[0].id;
    //   this.addressSelectionForm.patchValue({addressId: this.selectedAddressId});
    // }
  }


  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }


  onCardClick(addressId: string) {
    this.selectedAddressId = addressId;
    this.addressSelectionForm.get("addressId")?.patchValue(addressId);
  }

  toggleAddAddressForm(): void {
    this.showAddAddressForm = !this.showAddAddressForm;
    this.selectedAddressId = ""
  }

  onAddNewAddressClick() {
    this.selectedAddressId = '';
    this.addressSelectionForm.patchValue({addressId: ''}, {emitEvent: false});
    this.valid.emit(false);
    this.addNewAddress.emit();
  }

  onAddressFormSubmit(data: any): void {
    // console.log(data)
    if (this.addressCreateValid) {
      this.addressService.createAddress({
        line1: String(data.line1),
        city: String(data.city),
        countryId: String(data.countryId),
        postalCode: String(data.postalCode),
        unitNumber: String(data.unitNumber),
        ownerId: String(localStorage.getItem('userid'))
      }).subscribe(value => {
        this.refreshData()
        this.selectedAddress.emit(value);
        this.valid.emit(true);
      })
    }
    //todo: refresh the list of available addresses
  }

  refreshData() {
    this.addressRefreshTrigger$.next();
  }

  onAddressFormValidity(valid: boolean): void {
    this.addressCreateValid = valid
  }

  private updateCols(width: number) {
    if (width <= 600) {
      this.cols = 1;
    } else if (width <= 900) {
      this.cols = 2;
    } else {
      this.cols = 3;
    }
  }

}

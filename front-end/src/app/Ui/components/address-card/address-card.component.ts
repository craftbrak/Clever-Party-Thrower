import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Address} from "../../../entities/address.entity";


@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent {
  @Input() address?: Address;
  @Input() selected?: boolean;
  @Output() cardClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  onCardClick() {
    this.cardClick.emit();
  }
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Address} from "../../../entities/address.entity";
import {animate, state, style, transition, trigger} from "@angular/animations";


@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
  animations: [
    trigger('cardClick', [
      state('default', style({transform: 'scale(1)'})),
      state('clicked', style({transform: 'scale(0.85)'})),
      transition('default <=> clicked', [animate('100ms ease-in-out')]),
      transition('clicked => default', [animate('100ms')]),
    ]),
  ],
})
export class AddressCardComponent {
  @Input() address?: Address;
  @Input() selected?: boolean;
  @Output() cardClick: EventEmitter<void> = new EventEmitter<void>();
  animationState: 'default' | 'clicked' = 'default';

  constructor() {
  }

  onCardClick() {
    this.animationState = 'clicked';
    setTimeout(() => {
      this.animationState = 'default';
    }, 100);
    this.cardClick.emit();
  }
}

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AvatarFormComponent} from './avatar-form.component';
import {FormBuilder} from "@angular/forms";

describe('AvatarFormComponent', () => {
  let component: AvatarFormComponent;
  let fixture: ComponentFixture<AvatarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvatarFormComponent],
      providers: [FormBuilder]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

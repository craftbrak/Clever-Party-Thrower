import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateCarFormComponentComponent} from './create-car-form-component.component';

describe('CreateCarFormComponentComponent', () => {
  let component: CreateCarFormComponentComponent;
  let fixture: ComponentFixture<CreateCarFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCarFormComponentComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

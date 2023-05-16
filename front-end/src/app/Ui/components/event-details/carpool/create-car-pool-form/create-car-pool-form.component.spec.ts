import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateCarPoolFormComponent} from './create-car-pool-form.component';

describe('CreateCarPoolFormComponent', () => {
  let component: CreateCarPoolFormComponent;
  let fixture: ComponentFixture<CreateCarPoolFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCarPoolFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarPoolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

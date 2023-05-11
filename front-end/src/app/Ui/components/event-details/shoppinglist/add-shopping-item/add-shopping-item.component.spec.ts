import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddShoppingItemComponent} from './add-shopping-item.component';

describe('AddShoppingItemComponent', () => {
  let component: AddShoppingItemComponent;
  let fixture: ComponentFixture<AddShoppingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddShoppingItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShoppingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

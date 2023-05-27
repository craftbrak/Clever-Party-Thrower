import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpenseTreeComponent} from './expense-tree.component';

describe('ExpenseTreeComponent', () => {
  let component: ExpenseTreeComponent;
  let fixture: ComponentFixture<ExpenseTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseTreeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

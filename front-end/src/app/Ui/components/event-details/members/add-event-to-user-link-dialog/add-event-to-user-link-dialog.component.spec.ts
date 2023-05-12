import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEventToUserLinkDialogComponent} from './add-event-to-user-link-dialog.component';

describe('AddEventToUserLinkDialogComponent', () => {
  let component: AddEventToUserLinkDialogComponent;
  let fixture: ComponentFixture<AddEventToUserLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEventToUserLinkDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventToUserLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

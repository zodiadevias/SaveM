import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMenuEditModalComponent } from './business-menu-edit-modal.component';

describe('BusinessMenuEditModalComponent', () => {
  let component: BusinessMenuEditModalComponent;
  let fixture: ComponentFixture<BusinessMenuEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessMenuEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessMenuEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

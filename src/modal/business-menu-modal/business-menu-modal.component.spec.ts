import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMenuModalComponent } from './business-menu-modal.component';

describe('BusinessMenuModalComponent', () => {
  let component: BusinessMenuModalComponent;
  let fixture: ComponentFixture<BusinessMenuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessMenuModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

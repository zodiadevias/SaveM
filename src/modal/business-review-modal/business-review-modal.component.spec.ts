import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessReviewModalComponent } from './business-review-modal.component';

describe('BusinessReviewModalComponent', () => {
  let component: BusinessReviewModalComponent;
  let fixture: ComponentFixture<BusinessReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessReviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

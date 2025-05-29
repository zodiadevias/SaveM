import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentReviewOptionComponent } from './user-payment-review-option.component';

describe('UserPaymentReviewOptionComponent', () => {
  let component: UserPaymentReviewOptionComponent;
  let fixture: ComponentFixture<UserPaymentReviewOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPaymentReviewOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPaymentReviewOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

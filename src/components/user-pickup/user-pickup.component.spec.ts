import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPickupComponent } from './user-pickup.component';

describe('UserPickupComponent', () => {
  let component: UserPickupComponent;
  let fixture: ComponentFixture<UserPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPickupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

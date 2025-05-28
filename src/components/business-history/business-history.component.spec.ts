import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHistoryComponent } from './business-history.component';

describe('BusinessHistoryComponent', () => {
  let component: BusinessHistoryComponent;
  let fixture: ComponentFixture<BusinessHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

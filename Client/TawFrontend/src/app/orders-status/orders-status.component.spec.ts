import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ordersStatusComponent } from './orders-status.component';

describe('ordersStatusComponent', () => {
  let component: ordersStatusComponent;
  let fixture: ComponentFixture<ordersStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ordersStatusComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ordersStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

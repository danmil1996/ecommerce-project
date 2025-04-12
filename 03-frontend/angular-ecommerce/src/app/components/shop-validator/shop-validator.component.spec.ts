import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopValidatorComponent } from './shop-validator.component';

describe('ShopValidatorComponent', () => {
  let component: ShopValidatorComponent;
  let fixture: ComponentFixture<ShopValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopValidatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

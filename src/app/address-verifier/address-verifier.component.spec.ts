import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressVerifierComponent } from './address-verifier.component';

describe('AddressVerifierComponent', () => {
  let component: AddressVerifierComponent;
  let fixture: ComponentFixture<AddressVerifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressVerifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

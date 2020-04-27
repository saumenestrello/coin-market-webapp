import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Web3ErrorComponent } from './web3-error.component';

describe('Web3ErrorComponent', () => {
  let component: Web3ErrorComponent;
  let fixture: ComponentFixture<Web3ErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Web3ErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Web3ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UshistoryComponent } from './ushistory.component';

describe('UshistoryComponent', () => {
  let component: UshistoryComponent;
  let fixture: ComponentFixture<UshistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UshistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

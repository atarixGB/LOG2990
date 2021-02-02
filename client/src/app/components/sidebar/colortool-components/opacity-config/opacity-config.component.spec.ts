import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpacityConfigComponent } from './opacity-config.component';

describe('OpacityConfigComponent', () => {
  let component: OpacityConfigComponent;
  let fixture: ComponentFixture<OpacityConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpacityConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpacityConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

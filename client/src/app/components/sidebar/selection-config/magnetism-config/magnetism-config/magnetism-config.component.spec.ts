import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnetismConfigComponent } from './magnetism-config.component';

describe('MagnetismConfigComponent', () => {
  let component: MagnetismConfigComponent;
  let fixture: ComponentFixture<MagnetismConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagnetismConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagnetismConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

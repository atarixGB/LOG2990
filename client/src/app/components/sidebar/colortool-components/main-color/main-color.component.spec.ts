import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import{MainColorComponent} from './main-color.component';

describe('ColortoolComponentsComponent', () => {
  let component: MainColorComponent;
  let fixture: ComponentFixture<MainColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SprayConfigComponent } from './spray-config.component';

// tslint:disable
describe('SprayConfigComponent', () => {
  let component: SprayConfigComponent;
  let fixture: ComponentFixture<SprayConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

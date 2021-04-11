import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextConfigComponent } from './text-config.component';


//tslint:disable
describe('TextConfigComponent', () => {
  let component: TextConfigComponent;
  let fixture: ComponentFixture<TextConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recreate format label', () => {
    const expectedResult = '5px';
    const param = 5;
    expect(component.formatLabel(param)).toEqual(expectedResult);
});
});

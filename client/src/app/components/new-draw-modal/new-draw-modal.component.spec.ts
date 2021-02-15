import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrawModalComponent } from './new-draw-modal.component';

describe('NewDrawModalComponent', () => {
  let component: NewDrawModalComponent;
  let fixture: ComponentFixture<NewDrawModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDrawModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

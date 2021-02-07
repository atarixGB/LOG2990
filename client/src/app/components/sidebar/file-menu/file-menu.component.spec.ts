import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMenuComponent } from './file-menu.component';

describe('FileMenuComponent', () => {
    let component: FileMenuComponent;
    let fixture: ComponentFixture<FileMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FileMenuComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

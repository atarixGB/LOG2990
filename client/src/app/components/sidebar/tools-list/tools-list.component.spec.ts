import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ToolManagerService } from '@app/services/tools/tool-manager.service';
// import { ToolList } from '@app/constants';
import { ToolsListComponent } from './tools-list.component';

// tslint:disable
describe('ToolsListComponent', () => {
    let component: ToolsListComponent;
    let fixture: ComponentFixture<ToolsListComponent>;
    // let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    // let testToolList: ToolList

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolsListComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

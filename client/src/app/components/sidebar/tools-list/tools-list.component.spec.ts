import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolList } from '@app/constants';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { ToolsListComponent } from './tools-list.component';

// tslint:disable
class EventMock {
    button = 2;
    preventDefault() {
        return false;
    }
}
describe('ToolsListComponent', () => {
    let component: ToolsListComponent;
    let fixture: ComponentFixture<ToolsListComponent>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let testToolList: ToolList = {
        Pencil: 0,
        Eraser: 1,
        Line: 2,
        Rectangle: 3,
        Ellipse: 4,
    };

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

    it('should select tool clicked',()=>{

    })
});

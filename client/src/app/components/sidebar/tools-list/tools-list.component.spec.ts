import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
// import { ToolList } from '@app/constants';
// import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { ToolsListComponent } from './tools-list.component';

// tslint:disable
describe('ToolsListComponent', () => {
    let component: ToolsListComponent;
    let fixture: ComponentFixture<ToolsListComponent>;
    //let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    
    beforeEach(async(() => {
        //toolManagerSpy = jasmine.createSpyObj('ToolManagerService', ['switchTool']);
        TestBed.configureTestingModule({
            declarations: [ToolsListComponent],
            imports: [MatIconModule, MatGridListModule],
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

    // it('should select pencil', () => {
    //     let pencil = ToolList.Pencil;
    //     component.onTool(pencil);
    //     expect(toolManagerSpy.switchTool).toHaveBeenCalledTimes(1);
    // });

});

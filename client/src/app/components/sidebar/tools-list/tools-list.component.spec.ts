import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolList } from '@app/constants';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { ToolsListComponent } from './tools-list.component';


// tslint:disable

fdescribe('ToolsListComponent', () => {
    let component: ToolsListComponent;
    let fixture: ComponentFixture<ToolsListComponent>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let pencil:ToolList.Pencil;
    // let ellipse:ToolList.Ellipse;
    // let eraser:ToolList.Pencil;
    // let line:ToolList.Pencil;

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

    fit('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should select tool clicked',()=>{
    //     const buttonType = new MouseEvent('click', { buttons: 1 });
    //     
    //     const operation= spyOn(toolManagerSpy,'switchTool').and.stub()
    //     expect(operation).toHaveBeenCalledWith(testToolList);
    // })

    it('should select pencil',()=>{
        const operation= spyOn(toolManagerSpy,'switchTool').and.stub()
        expect(operation).toHaveBeenCalledWith(pencil);
    })
});

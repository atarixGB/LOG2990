import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MoveSelectionService } from '@app/services/selection/move-selection.service';
import { TextService } from '@app/services/tools/text/text.service';
import { SelectionConfigComponent } from './selection-config.component';

// tslint:disable
fdescribe('SelectionConfigComponent', () => {
    let component: SelectionConfigComponent;
    let fixture: ComponentFixture<SelectionConfigComponent>;
    let moveSelectionServiceSpy: jasmine.SpyObj<MoveSelectionService>;
    let textServiceSpy: jasmine.SpyObj<TextService>;

    beforeEach(async(() => {
        moveSelectionServiceSpy = jasmine.createSpyObj('MoveSelectionService', ['enableMagnetism']);
        textServiceSpy = jasmine.createSpyObj('TextService', ['']);

        TestBed.configureTestingModule({
            providers: [{ provide: MoveSelectionService, useValue: moveSelectionServiceSpy }],
            declarations: [SelectionConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should enable grid magnetism', () => {
        component.enableGridMagnetism(true);
        expect(component.isMagnetismEnabled).toBeTrue();
        expect(moveSelectionServiceSpy.isMagnetism).toBeTrue();
        expect(moveSelectionServiceSpy.enableMagnetism).toHaveBeenCalled();
    });

    it('should turn on magnetism feature if g is pressed for the first time', () => {
        const input = fixture.debugElement.query(By.css('input'));
        input.triggerEventHandler('window:keydown.m', {});
        fixture.detectChanges();

        textServiceSpy.isWriting = false;
        component.isMagnetismEnabled = false;
        moveSelectionServiceSpy.isMagnetism = false;

        component.gIsClicked();
        expect(component.isMagnetismEnabled).toBeTrue();
        expect(moveSelectionServiceSpy.isMagnetism).toBeTrue();
    });

    it('should not turn on magnetism feature if isWriting of TextService is true', () => {
        textServiceSpy.isWriting = true;
        component.isMagnetismEnabled = false;
        moveSelectionServiceSpy.isMagnetism = false;

        component.gIsClicked();
        expect(component.isMagnetismEnabled).toBeFalse();
        expect(moveSelectionServiceSpy.isMagnetism).toBeFalse();
    });
});

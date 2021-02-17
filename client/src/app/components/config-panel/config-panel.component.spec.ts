import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigPanelComponent } from './config-panel.component';

fdescribe('ConfigPanelComponent', () => {
    let component: ConfigPanelComponent;
    let fixture: ComponentFixture<ConfigPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigPanelComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle config panel', () => {
        component.isOpened = false;

        component.toggleConfigPanel();
        expect(component.isOpened).toEqual(true);
    });
});

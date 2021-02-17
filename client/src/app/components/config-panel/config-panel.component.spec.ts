import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlider } from '@angular/material/slider';
import { ColorDisplayerComponent } from 'src/app/components/sidebar/color-components/color-displayer/color-displayer.component';
import { PencilConfigComponent } from 'src/app/components/sidebar/pencil-config/pencil-config.component';
import { ConfigPanelComponent } from './config-panel.component';

//tslint:disable
describe('ConfigPanelComponent', () => {
    let component: ConfigPanelComponent;
    let fixture: ComponentFixture<ConfigPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigPanelComponent, PencilConfigComponent, ColorDisplayerComponent, MatSlider],
            imports: [MatIconModule, MatSidenavModule, MatDialogModule, FormsModule],
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

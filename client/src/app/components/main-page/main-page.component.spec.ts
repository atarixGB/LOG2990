import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { MainPageComponent } from './main-page.component';

//tslint:disable
describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let dialogOpenSpy = jasmine.createSpy('open');
    let autoSaveServiceSpy: jasmine.SpyObj<AutoSaveService>;

    beforeEach(async(() => {
        autoSaveServiceSpy = jasmine.createSpyObj('AutoSaveService', ['loadImage', 'localStorageIsEmpty']);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: MatDialog, useValue: { open: dialogOpenSpy } },
                { provide: AutoSaveService, useValue: autoSaveServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should open Carousel modal when Ctrl+G are pressed', () => {
        const keyboardEvent = { ctrlKey: true, key: 'g', preventDefault(): void {} } as KeyboardEvent;
        dialogOpenSpy.and.stub();
        component.handleKeyDown(keyboardEvent);
        expect(dialogOpenSpy).toHaveBeenCalled();
    });

    it('should NOT open Carousel modal when Ctrl+G key are NOT pressed', () => {
        const keyboardEvent = { ctrlKey: false, key: 'g', preventDefault(): void {} } as KeyboardEvent;
        dialogOpenSpy.and.stub();
        component.handleKeyDown(keyboardEvent);
        expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open Carousel modal when clicking on "Ouvrir le carousel de dessins" button', () => {
        dialogOpenSpy.and.stub();
        component.openCarousel();
        expect(dialogOpenSpy).toHaveBeenCalled();
    });

    xit('should redirect page to editor when clicking on "Continuer un dessin"', () => {
        // autoSaveServiceSpy.loadImage.and.stub();
        // const replaceSpy = spyOn<any>(window.location, 'replace').and.stub();
        // component.continueDrawing();
        // expect(autoSaveServiceSpy.loadImage).toHaveBeenCalled();
        // expect(replaceSpy).toHaveBeenCalledWith('http://localhost:4200/editor');
    });
});

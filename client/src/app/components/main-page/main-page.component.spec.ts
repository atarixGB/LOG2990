//import { inject } from 'inversify';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from './main-page.component';
import { By } from '@angular/platform-browser';


fdescribe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    fit("should have as title 'Poly-Dessin'", () => {
        expect(component.title).toEqual('Poly-Dessin');
        const title = fixture.debugElement.query(By.css('h1')).nativeElement;
        expect(title.innerHTML).toBe('Poly-Dessin');
    });

    // fit('should be redirected to editor page when button clicked', async(inject([Location], (location: Location) => {

    //     fixture.detectChanges();

    //     let buttonElements = fixture.debugElement.queryAll(By.css('button'));   // fetch all the elements with button tag.

    //     buttonElements[0].nativeElement.click();

    //     fixture.detectChanges();
    //     fixture.whenStable().then(
    //         () => {
    //             expect(location.pathname).toBe(['/editor']);     // check if url is routed to editor page after back button is clicked
    //         }
    //     );
    // })));
   
});

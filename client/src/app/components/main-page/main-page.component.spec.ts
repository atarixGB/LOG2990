// import { inject } from 'inversify';
// import { Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
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

    it("should have as title 'Poly-Dessin'", () => {
        expect(component.title).toEqual('Poly-Dessin');
        const title = fixture.debugElement.query(By.css('h1')).nativeElement;
        expect(title.innerHTML).toBe('Poly-Dessin');
    });

    // fit('should be redirected to editor page when button clicked', () => {
    //     fixture.detectChanges();
    //     const location: Location = TestBed.inject(Location);
    //     let buttonElements = fixture.debugElement.queryAll(By.css('button')); // fetch all the elements with button tag.

    //     buttonElements[0].nativeElement.click();

    //     fixture.detectChanges();
    //     expect(location.path()).toBe('/editor'); // check if url is routed to editor page after back button is clicked

    // });
});

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel/carousel-modal/carousel.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'Poly-Dessin';

    constructor(public dialog: MatDialog) {}
    openCarousel(): void {
        this.dialog.open(CarouselComponent);
    }
}

import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CarouselComponent } from '@app/components/carousel/carousel-modal/carousel.component';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'Poly-Dessin';
    isDisabled: boolean;

    constructor(public dialog: MatDialog, private router: Router, private autoSaveService: AutoSaveService) {
        // this.isDisabled = true;
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'g') {
            event.preventDefault();
            this.dialog.open(CarouselComponent, {});
        }
    }

    openCarousel(): void {
        this.dialog.open(CarouselComponent);
    }

    continueDrawing(): void {
        console.log(localStorage);
        const drawing: DrawingData = {
            title: this.autoSaveService.localDrawing.title,
            height: this.autoSaveService.localDrawing.height,
            width: this.autoSaveService.localDrawing.width,
            body: this.autoSaveService.localDrawing.body,
        };

        this.router.navigate(['/'], { skipLocationChange: true }).then(() => this.router.navigate(['editor', drawing]));
    }
}

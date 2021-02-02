import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorChoice } from 'src/app/interfaces-enums/color-choice';
import { Coordinates } from 'src/app/interfaces-enums/coordinates';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

//dimension de l'affichage
const WIDTH = 20;
const HEIGHT = 200;
//localisation for the color stops in the palette gradients
const ONE_SIXTH = 0.17;
const ONE_THIRD = 0.33;
const ONE_HALF = 0.5;
const TWO_THIRD = 0.67;
const FIVE_SIXTH = 0.83;

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit {
    @ViewChild('colorPalette', { static: false })
    paletteCanvas: ElementRef;
    paletteContext: CanvasRenderingContext2D;

    @Output()
    updateColor: EventEmitter<string> = new EventEmitter();

    constructor(@Inject(MAT_DIALOG_DATA) public colorChoice: ColorChoice, private colorManager: ColorManagerService) {}

    ngAfterViewInit() {
        this.createPaletteDisplayer();
    }

    createPaletteDisplayer(): void {
        if (!this.paletteContext) {
            this.paletteContext = this.paletteCanvas.nativeElement.getContext('2d');
        }
        const gradientToBottom = this.paletteContext.createLinearGradient(0, 0, 0, HEIGHT);
        gradientToBottom.addColorStop(0, 'rgba(255,0,0,1)');
        gradientToBottom.addColorStop(ONE_SIXTH, 'rgba(255,255,0,1)');
        gradientToBottom.addColorStop(ONE_THIRD, 'rgba(0,255,0,1)');
        gradientToBottom.addColorStop(ONE_HALF, 'rgba(0,255,255,1)');
        gradientToBottom.addColorStop(TWO_THIRD, 'rgba(0,0,255,1)');
        gradientToBottom.addColorStop(FIVE_SIXTH, 'rgba(255,0,255,1)');
        gradientToBottom.addColorStop(1, 'rgba(255,0,0,1)');
        this.paletteContext.beginPath();
        this.paletteContext.rect(0, 0, WIDTH, HEIGHT);
        this.paletteContext.fillStyle = gradientToBottom;
        this.paletteContext.fill();
        this.paletteContext.closePath();
    }

    updateColorWithCoordinates(coordinates: Coordinates): void {
        const colorPixel = this.paletteContext.getImageData(coordinates.x, coordinates.y, 1, 1).data;
        if (colorPixel) {
            this.colorManager.updateColorWithPixel(this.colorChoice, colorPixel);
        }
    }

    mouseDownFromGradient(event: MouseEvent): void {
        const coordinates: Coordinates = { x: event.offsetX, y: event.offsetY };
        this.updateColorWithCoordinates(coordinates);
        this.updateColor.emit(this.colorManager.colorSelected[this.colorChoice].inString);
    }
}

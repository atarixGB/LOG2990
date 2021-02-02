import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorChoice } from 'src/app/interfaces-enums/color-choice';
import { Coordinates } from 'src/app/interfaces-enums/coordinates';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

const WIDTH = 20;
const HEIGHT = 200;

@Component({
    selector: 'app-opacity-config',
    templateUrl: './opacity-config.component.html',
    styleUrls: ['./opacity-config.component.scss'],
})
export class OpacityConfigComponent implements OnChanges, AfterViewInit {
    @ViewChild('opacityColor', { static: false })
    paletteCanvas: ElementRef;
    paletteContext: CanvasRenderingContext2D;

    private gradientToBottom: CanvasGradient;

    @Input() updateColor: string;
    @Input() updateOpacity: string;

    constructor(@Inject(MAT_DIALOG_DATA) public colorChoice: ColorChoice, private colorManager: ColorManagerService) {}

    ngAfterViewInit(): void {
        this.opacityDisplayer();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.updateColor) {
            if (!changes.updateColor.isFirstChange()) {
                this.paletteContext.clearRect(0, 0, WIDTH, HEIGHT);
                this.opacityDisplayer();
            }
        }
        if (changes.updateOpacity) {
            if (!changes.updateOpacity.isFirstChange()) {
                this.paletteContext.clearRect(0, 0, WIDTH, HEIGHT);
                this.opacityDisplayer();
            }
        }
    }

    opacityDisplayer(): void {
        this.paletteContext = this.paletteCanvas.nativeElement.getContext('2d');
        this.gradientToBottom = this.paletteContext.createLinearGradient(0, 0, 0, HEIGHT);
        this.gradientToBottom.addColorStop(0, this.colorManager.getColorStringWithCustomAlpha(this.colorChoice, true));
        this.gradientToBottom.addColorStop(1, this.colorManager.getColorStringWithCustomAlpha(this.colorChoice, false));
        this.paletteContext.beginPath();
        this.paletteContext.rect(0, 0, WIDTH, HEIGHT);
        this.paletteContext.fillStyle = this.gradientToBottom;
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
    }
}

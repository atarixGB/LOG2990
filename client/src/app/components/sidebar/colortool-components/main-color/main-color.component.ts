// Some external source code has been used for reference
// Lukas Marx (2018) Creating a Color Picker Component with Angular [Online]
// Available : https://github.com/LukasMarx/angular-color-picker

import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorChoice } from 'src/app/interfaces-enums/color-choice';
import { Coordinates } from 'src/app/interfaces-enums/coordinates';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

const WIDTH = 200;
const HEIGHT = 200;

@Component({
    selector: 'app-main-color',
    templateUrl: './main-color.component.html',
    styleUrls: ['./main-color.component.scss'],
})
export class MainColorComponent implements AfterViewInit, OnChanges {
    @ViewChild('mainColorGradient', { static: false }) mainColorGradientSelectionCanvas: ElementRef;
    colorGradientContext: CanvasRenderingContext2D;
    @Input() shouldUpdateGradient: string;
    @Output() shouldUpdateForAlpha: EventEmitter<string> = new EventEmitter();

    constructor(@Inject(MAT_DIALOG_DATA) public colorChoice: ColorChoice, private colorManager: ColorManagerService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.shouldUpdateGradient.isFirstChange()) {
            this.createMainGradientDisplayer();
        }
    }

    ngAfterViewInit(): void {
        this.createMainGradientDisplayer();
    }

    createMainGradientDisplayer(): void {
        this.colorGradientContext = this.mainColorGradientSelectionCanvas.nativeElement.getContext('2d');
        const gradientToBottom = this.colorGradientContext.createLinearGradient(0, 0, 0, HEIGHT);
        gradientToBottom.addColorStop(0, 'rgba(0,0,0,0');
        gradientToBottom.addColorStop(1, 'rgba(0,0,0,1)');
        const gradientToRight = this.colorGradientContext.createLinearGradient(0, 0, WIDTH, 0);
        gradientToRight.addColorStop(0, 'rgba(255,255,255,1)');
        gradientToRight.addColorStop(1, 'rgba(255,255,255,0)');
        this.colorGradientContext.beginPath();
        this.colorGradientContext.rect(0, 0, WIDTH, HEIGHT);
        this.colorGradientContext.fillStyle = this.colorManager.colorSelected[this.colorChoice].inString;
        this.colorGradientContext.fill();
        this.colorGradientContext.fillStyle = gradientToRight;
        this.colorGradientContext.fill();
        this.colorGradientContext.fillStyle = gradientToBottom;
        this.colorGradientContext.fill();
        this.colorGradientContext.closePath();
    }

    updateColorWithCoordinates(coordinates: Coordinates): void {
        const colorPixel = this.colorGradientContext.getImageData(coordinates.x, coordinates.y, 1, 1).data;
        if (colorPixel) {
            this.colorManager.updateColorWithPixel(this.colorChoice, colorPixel);
        }
    }

    mouseDownFromGradient(event: MouseEvent): void {
        const coordinates: Coordinates = { x: event.offsetX, y: event.offsetY };
        this.updateColorWithCoordinates(coordinates);
        this.shouldUpdateForAlpha.emit(this.colorManager.colorSelected[this.colorChoice].inString);
    }
}

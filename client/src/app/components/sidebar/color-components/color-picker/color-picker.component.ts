import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COLOR_POSITION } from '@app/constants';
import { Vec2 } from 'src/app/classes/vec2';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { EventListeners } from 'src/app/interfaces-enums/event-listeners';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
    @ViewChild('htmlCanvas', { static: false }) htmlCanvas: ElementRef;
    context: CanvasRenderingContext2D;
    coord: Vec2;
    colorOrder: ColorOrder;
    arrayColorPixel: Uint8ClampedArray;
    eventListeners: EventListeners;

    constructor(private colorManager: ColorManagerService) {
        this.eventListeners = {} as EventListeners;
    }

    ngOnInit(): void {
        this.initExtend();
    }
    protected initExtend(): void {
        this.eventListeners.mouseDown = ($event) => this.onMouseDown($event);
        this.eventListeners.contextMenu = ($event) => this.onContextMenu($event);
        this.eventListeners.changedMouseDown = true;
        // this.eventListeners.changedContextMenu = true;
    }

    private onContextMenu(event: MouseEvent): boolean {
        this.updateContextMenu(event);
        return false;
    }

    private updateContextMenu(event: MouseEvent): void {
        // preventDefault indicates that if the event is not treated explicitly,
        // its default action should not be considered
        event.preventDefault();
    }

    private pickPixelColor(coord: Vec2, colorOrder: ColorOrder, primary: string): void {
        this.arrayColorPixel = this.context.getImageData(coord.x, coord.y, 1, 1).data;
        if (this.arrayColorPixel) {
            this.colorManager.updatePixelColor(colorOrder, this.arrayColorPixel);
        }
    }

    private onMouseDown(event: MouseEvent): void {
        event.preventDefault();
        this.coord = { x: event.offsetX, y: event.offsetY };
        if (event.button === 0) {
            // Left button clicked
            this.pickPixelColor(this.coord, ColorOrder.primaryColor, COLOR_POSITION[0]);
        } else if (event.button === 2) {
            // Right button clicked
            this.pickPixelColor(this.coord, ColorOrder.secondaryColor, COLOR_POSITION[1]);
        }
    }
}

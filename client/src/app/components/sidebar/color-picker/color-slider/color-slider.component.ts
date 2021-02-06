import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

const ONE_SIXTH = 0.17;
const ONE_THIRD = 0.34;
const ONE_HALF = 0.51;
const TWO_THIRD = 0.68;
const FIVE_SIXTH = 0.85;

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
    @ViewChild('canvas', { static: false })
    canvas: ElementRef;

    @Output()
    color: EventEmitter<string> = new EventEmitter();

    // object context that will hold the value obtained by the method getContext in the canvas element
    context: CanvasRenderingContext2D;
    // both the properties are used in the implemetation of the mousedown
    private mousedown: boolean = false;
    private selectedHeight: number;

    // calling the draw method inside the ngAfterViewInit lifecycle hook
    // this will make sure that the draw method is called after we are sure that
    // the canvas is already on the screen
    ngAfterViewInit(): void {
        this.draw();
    }

    draw(): void {
        if (!this.context) {
            this.context = this.canvas.nativeElement.getContext('2d'); // getting the context and putting it in the object we created
        }

        // get the height and width for the canvas element and add the clear whole canvas option
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;
        this.context.clearRect(0, 0, width, height);

        // To create this rainbow-like effect for our color-slider, we are going to use a gradient.
        const gradient = this.context.createLinearGradient(0, 0, 0, height);

        // colorstops, to devide the gradient into 6 different sub-gradients.
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(ONE_SIXTH, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(ONE_THIRD, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(ONE_HALF, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(TWO_THIRD, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(FIVE_SIXTH, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

        // using the gradiant to fill the whole canvas with it
        this.context.beginPath();
        this.context.rect(0, 0, width, height);
        this.context.fillStyle = gradient;
        this.context.fill();
        this.context.closePath();

        // indicate the current color with a nob (which will be a simple rectangle in our case).
        // what we do here is drawing a transparent rectangle with a white border of 5px at the selectedHeight
        // the draw method is called every time selectedHeight changes, the nob always indicates the currently selected value.
        if (this.selectedHeight) {
            this.context.beginPath();
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 5;
            this.context.rect(0, this.selectedHeight - 5, width, 10);
            this.context.stroke();
            this.context.closePath();
        }
    } // end of the method draw()

    // implementation of the used callbacks for mousedown and mousemove

    // ------------------------------------
    // first: implementation of the mousedown

    onMouseDown(evt: MouseEvent): void {
        this.mousedown = true;
        // We need this height to display a nob at that position.
        this.selectedHeight = evt.offsetY;
        // trigger the draw method. We do so to update the position of the selection-nob,
        this.draw();
        // the method emitColor responsible for reading the selected color value and communicating that change to the parent component
        this.emitColor(evt.offsetX, evt.offsetY);
    }

    // second: implementation of the mousemove method
    onMouseMove(evt: MouseEvent): void {
        // check if our "mousedown"-property is set to true BECAUSE we only want to react if the user is dragging the slider.
        if (this.mousedown) {
            // We update the selected height,
            this.selectedHeight = evt.offsetY;
            // redraw our canvas
            this.draw();
            // emit the new color.
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }
    // Finally, we also need to know when the user stops holding the mouse-button down.
    // Because at that point, the mouse could have already left our canvas, we need to register that event listener globally.
    // Otherwise, we could end up with our mousedown-property stuck on true
    // HostListener is a way of registering an event-callback
    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    // Implementation of emitColor used previously
    // This method is reading the the color at the selected position and is emitting it using the components color-emitter
    emitColor(x: number, y: number): void {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.color.emit(rgbaColor);
    }

    // Implementation of getColorAtPosition
    // This method is using the canvas context to read out the color at the given position.
    getColorAtPosition(x: number, y: number): string {
        const imageData = this.context.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
}

import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
    @Input()
    hue: string;

    @Output()
    color: EventEmitter<string> = new EventEmitter(true);

    @ViewChild('canvas')
    canvas: ElementRef;

    context: CanvasRenderingContext2D;

    private mousedown: boolean = false;

    primarySelectedPosition: { x: number; y: number };
    secondarySelectedPosition: { x: number; y: number };

    ngAfterViewInit(): void {
        this.draw();
    }

    draw(): void {
        if (!this.context) {
            this.context = this.canvas.nativeElement.getContext('2d');
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.context.fillStyle = this.hue || 'rgba(255,255,255,1)';
        this.context.fillRect(0, 0, width, height);

        const whiteGrad = this.context.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

        this.context.fillStyle = whiteGrad;
        this.context.fillRect(0, 0, width, height);

        const blackGrad = this.context.createLinearGradient(0, 0, 0, height);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

        this.context.fillStyle = blackGrad;
        this.context.fillRect(0, 0, width, height);

        if (this.primarySelectedPosition) {
            this.context.strokeStyle = 'white';
            this.context.fillStyle = 'white';
            this.context.beginPath();
            this.context.arc(this.primarySelectedPosition.x, this.primarySelectedPosition.y, 10, 0, 2 * Math.PI);
            this.context.lineWidth = 5;
            this.context.stroke();
        }

        if (this.secondarySelectedPosition) {
            this.context.strokeStyle = 'white';
            this.context.fillStyle = 'white';
            this.context.beginPath();
            this.context.arc(this.secondarySelectedPosition.x, this.secondarySelectedPosition.y, 10, 0, 2 * Math.PI);
            this.context.lineWidth = 5;
            this.context.stroke();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hue) {
            this.draw();
            const pos = this.primarySelectedPosition;
            if (pos) {
                this.color.emit(this.getColorAtPosition(pos.x, pos.y));
            }
        }
        if (changes.hue) {
            this.draw();
            const pos = this.secondarySelectedPosition;
            if (pos) {
                this.color.emit(this.getColorAtPosition(pos.x, pos.y));
            }
        }
        // change the transparency with the opacity given and display the color
        if (changes.opacity) {
            this.context.globalAlpha = +'opacity';
            this.draw();
            const pos = this.primarySelectedPosition;
            if (pos) {
                this.color.emit(this.getColorAtPosition(pos.x, pos.y));
            }
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    onMouseDown(evt: MouseEvent): void {
        this.mousedown = true;
        this.primarySelectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mousedown) {
            this.primarySelectedPosition = { x: evt.offsetX, y: evt.offsetY };
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }

    emitColor(x: number, y: number): void {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.color.emit(rgbaColor);
    }

    getColorAtPosition(x: number, y: number): string {
        const imageData = this.context.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
}

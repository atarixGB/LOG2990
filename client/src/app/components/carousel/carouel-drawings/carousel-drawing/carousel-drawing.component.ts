import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Drawing } from '@common/communication/drawing';

@Component({
    selector: 'app-carousel-drawing',
    templateUrl: './carousel-drawing.component.html',
    styleUrls: ['./carousel-drawing.component.scss'],
})
export class CarouselDrawingComponent {
    @Input() drawing: Drawing;
    @Output() componentClicked = new EventEmitter<string>();

    @HostListener('click', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.componentClicked.emit(this.drawing.imageURL);
    }
}

import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-carousel-drawing',
    templateUrl: './carousel-drawing.component.html',
    styleUrls: ['./carousel-drawing.component.scss'],
})
export class CarouselDrawingComponent {
    @Input() imagesURL: string;
    @ViewChild('mainContainer', { static: false }) mainContainer: ElementRef<HTMLDivElement>;
    @Output() componentClicked = new EventEmitter<string>();
    name: string;
    tags: string[];
    constructor() {
        this.name = 'Mon dessin';
        this.tags = ['test', 'dessin'];
    }

    @HostListener('click', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.mainContainer.nativeElement.style.border = '2px solid red';
        this.componentClickedEvent();
    }

    componentClickedEvent(): void {
        this.componentClicked.emit(this.imagesURL);
    }

    defaultColor(): void {
        this.mainContainer.nativeElement.style.border = '2px solid black';
    }
}

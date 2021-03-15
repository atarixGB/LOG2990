import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-carousel-drawing',
    templateUrl: './carousel-drawing.component.html',
    styleUrls: ['./carousel-drawing.component.scss'],
})
export class CarouselDrawingComponent {
    @Input() imagesURL: string;
    name: string;
    tags: string[];
    constructor() {
        this.name = 'Mon dessin';
        this.tags = ['test', 'dessin'];
    }
}

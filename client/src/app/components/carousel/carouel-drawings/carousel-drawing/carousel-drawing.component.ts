import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-carousel-drawing',
    templateUrl: './carousel-drawing.component.html',
    styleUrls: ['./carousel-drawing.component.scss'],
})
export class CarouselDrawingComponent implements OnInit {
    @Input() imagesURL: string;
    name: string;
    tags: string[];
    constructor() {
        this.imagesURL = 'https://image.freepik.com/vecteurs-libre/animal-dessin-style-boho-icone-vector-illustration-graphique_25030-12802.jpg';
        this.name = 'Mon dessin';
        this.tags = ['test', 'dessin'];
    }
    ngOnInit(): void {}
}

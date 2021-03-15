import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
    images: string[];
    placement: string[];
    private index: number;
    private afterNext: boolean;
    private afterPrevious: boolean;
    //  private nextN: number;
    constructor() {
        this.index = 0;
        this.images = [
            'https://image.freepik.com/vecteurs-libre/animal-dessin-style-boho-icone-vector-illustration-graphique_25030-12802.jpg',
            'https://cdn.arstechnica.net/wp-content/uploads/2017/07/ms-paint-rip-800x500.png',
            'https://1gew6o3qn6vx9kp3s42ge0y1-wpengine.netdna-ssl.com/wp-content/uploads/sites/140/2014/01/Boston.jpg',
            'https://digitalsynopsis.com/wp-content/uploads/2018/03/grandma-creates-beautiful-artwork-in-ms-paint-14.jpg',
        ];
        this.placement = ['', '', ''];
        this.nextImages();
        this.afterNext = false;
        this.afterPrevious = false;
    }

    nextImages() {
        console.log('dans next');
        if (this.afterPrevious) {
            this.index++;
            this.afterPrevious = false;
        }
        for (let i = 0; i < 3; i++) {
            if (this.index > this.images.length - 1) {
                this.index = 0;
            }
            console.log(this.index);
            this.placement[i] = this.images[this.index];
            this.index++;
        }
        this.afterNext = true;
    }
    previousImages() {
        console.log('dans previous');
        if (this.afterNext) {
            this.afterNext = false;
            this.index = this.index - 3;
            console.log('dans after next ' + this.index);
        }
        for (let i = 2; i >= 0; i--) {
            this.index--;
            if (this.index < 0) {
                this.index = this.images.length - 1;
            }
            console.log(this.index);
            this.placement[i] = this.images[this.index];
            this.afterNext = false;
        }
        this.afterPrevious = true;
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        console.log(event.code);
        if (event.code == 'ArrowLeft') {
            this.previousImages();
        }
        if (event.code == 'ArrowRight') {
            this.nextImages();
        }
    }
}

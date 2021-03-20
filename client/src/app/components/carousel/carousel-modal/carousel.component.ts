import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IndexService } from '@app/services/index/index.service';
import { CarouselDrawingComponent } from '../carouel-drawings/carousel-drawing/carousel-drawing.component';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
    images: string[];
    placement: string[];
    private index: number;
    private afterNext: boolean;
    private afterPrevious: boolean;
    private chosenURL: string;
    isLoading: boolean;

    @ViewChild('canvas') canvasRef: ElementRef<CarouselDrawingComponent>;
    @ViewChild('firstDraw') firstDraw: ElementRef<CarouselDrawingComponent>;
    @ViewChild('secondDraw') secondDraw: ElementRef<CarouselDrawingComponent>;
    @ViewChild('thirdDraw') thirdDraw: ElementRef<CarouselDrawingComponent>;

    constructor(public indexService: IndexService, private router: Router, private dialogRef: MatDialogRef<CarouselComponent>) {
        this.index = 0;
        this.images = [];
        this.placement = ['', '', ''];
        this.afterNext = false;
        this.afterPrevious = false;
        this.isLoading = true;
        this.chosenURL = '';
    }

    async ngAfterViewInit() {
        this.getDrawingsUrls();
        // this.indexService.getTitles().then((result: DrawingData[]) => {
        //     console.log(result);
        // });
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
            this.placement[i] = this.images[this.index];
            this.index++;
        }
        this.afterNext = true;
    }
    previousImages() {
        console.log('dans previous');
        if (this.afterNext) this.index--;
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
        if (event.code == 'ArrowLeft') {
            this.previousImages();
        }
        if (event.code == 'ArrowRight') {
            this.nextImages();
        }
    }

    getDrawingsUrls() {
        console.log('dans drawingURLs: ' + this.images);
        this.isLoading = true;
        this.indexService.getAllDrawingUrls().then((drawings: string[]) => {
            this.isLoading = false;
            this.images = drawings;
            console.log('les images :' + this.images);
            this.nextImages();
        });
    }

    // EXEMPLE POUR AJOUTER A NOTRE CANVAS quand on va retrieve du carousel, voir le HTML
    async getNewImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (err: string | Event) => {
                reject(err);
            };
            img.src = src;
        });
    }

    chosen(url: string) {
        this.chosenURL = url;
    }

    async deleteDrawing() {
        // mettre if si pas d'image selectionne
        let pathname = (url: string): string => {
            let parseUrl = new URL(url).pathname;
            parseUrl = parseUrl.split('/')[4].split('.')[0];
            return parseUrl;
        };
        this.indexService.deleteDrawingById(pathname(this.chosenURL)).then(() => {
            console.log('deleted');
            this.getDrawingsUrls();
        });
    }

    loadImage() {
        this.router.navigate(['/'], { skipLocationChange: true }).then(() => this.router.navigate(['editor']));
        this.dialogRef.close();
    }
}

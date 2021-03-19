import { AfterViewInit, Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IndexService } from '@app/services/index/index.service';

const DRAWING_ID = 0;
const LAST_INDEX = 4;

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
    // @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>; // Pour mettre le dessin selectionne sur le canvas
    images: string[];
    placement: string[];
    isLoading: boolean;
    private index: number;
    private afterNext: boolean;
    private afterPrevious: boolean;
    private chosenURL: string;

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
        console.log(event.code);
        if (event.code == 'ArrowLeft') {
            this.previousImages();
        }
        if (event.code == 'ArrowRight') {
            this.nextImages();
        }
    }

    getDrawingsUrls(): void {
        this.isLoading = true;
        this.indexService
            .getAllDrawingUrls()
            .then((drawings: string[]) => {
                this.isLoading = false;
                this.images = drawings;
                this.nextImages();
            })
            .catch((error) => {
                throw error;
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

    deleteDrawing() {
        // mettre if si pas d'image selectionne
        console.log('carousel: ', this.chosenURL);
        let pathname = (url: string): string => {
            let parseUrl = new URL(url).pathname;
            parseUrl = parseUrl.split('/')[LAST_INDEX].split('.')[DRAWING_ID];
            return parseUrl;
        };

        this.indexService
            .deleteDrawingById(pathname(this.chosenURL))
            .then(() => {
                this.images.length = 0;
                this.isLoading = false;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    loadImage() {
        this.router.navigate(['/'], { skipLocationChange: true }).then(() => this.router.navigate(['editor']));
        this.dialogRef.close();
    }
}

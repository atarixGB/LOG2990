import { AfterViewInit, Component, HostListener } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IndexService } from '@app/services/index/index.service';

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

    drawing: SafeUrl;
    drawingsUrls: string[];
    urls: string[];

    // @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
    constructor(public indexService: IndexService) {
        this.index = 0;

        this.images = [''];
        this.placement = ['', '', ''];
        this.afterNext = false;
        this.afterPrevious = false;
        this.getDrawingsUrls();
        this.nextImages();
    }

    ngAfterViewInit() {
        this.getDrawingsUrls();
        this.nextImages();
    }
    nextImages() {
        //console.log('dans next. Init :', this.index);
        if (this.afterPrevious) {
            this.index++;
            this.afterPrevious = false;
        }

        for (let i = 0; i < 3; i++) {
            if (this.index > this.images.length - 1) {
                this.index = 0;
            }
            console.log('index:', this.index);
            this.placement[i] = this.images[this.index];
            this.index++;
            console.log('index at end for', this.index);
        }
        console.log(this.images);
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

    async getDrawingsUrls(): Promise<void> {
        this.indexService.getAllDrawingUrls().subscribe((res: string[]) => {
            //this.drawingsUrls = res;
            this.images = res;
            console.log(this.images);
            // this.getDrawing();
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

    async getDrawing(): Promise<void> {
        console.log(this.drawingsUrls, 'LLLL');
        for (let i = 0; i < this.drawingsUrls.length; i++) {
            this.drawing = this.drawingsUrls[i];
            // const img = await this.getNewImage(this.drawingsUrls[i]);
            // const ctx = this.canvasRef.nativeElement.getContext('2d');
            // ctx?.drawImage(img, 0, 0);
        }
    }
}

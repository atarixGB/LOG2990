import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IndexService } from '@app/services/index/index.service';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
    @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;

    drawing: SafeUrl;
    drawingsUrls: string[];
    urls: string[];

    constructor(public indexService: IndexService) {}

    ngOnInit(): void {
        this.getDrawingsUrls();
    }

    getDrawingsUrls(): void {
        this.indexService.getAllDrawingUrls().subscribe((res: string[]) => {
            this.drawingsUrls = res;
            this.getDrawing();
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
        for (const url of this.drawingsUrls) {
            // for (let i = 0; i < this.drawingsUrls.length; i++) {
            this.drawing = url;
            // const img = await this.getNewImage(this.drawingsUrls[i]);
            // const ctx = this.canvasRef.nativeElement.getContext('2d');
            // ctx?.drawImage(img, 0, 0);
        }
    }
}

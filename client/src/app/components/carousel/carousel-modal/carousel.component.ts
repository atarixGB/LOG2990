import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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

    constructor(public indexService: IndexService, private sanitizer: DomSanitizer) {
        if (this.sanitizer) {
        }
    }

    ngOnInit(): void {
        this.getDrawingsUrls();
    }

    getDrawingsUrls(): void {
        this.indexService.getAllDrawingUrls().subscribe((res: string[]) => {
            this.drawingsUrls = res;
            this.getDrawing();
        });
    }

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
            const img = await this.getNewImage(this.drawingsUrls[i]);
            const ctx = this.canvasRef.nativeElement.getContext('2d');
            ctx?.drawImage(img, 0, 0);
        }

        // this.indexService.getDrawing(imageUrl).subscribe(
        //     (response) => {
        //         // Do what you want with the data here
        //         this.drawing = response;
        //         let objectURL = URL.createObjectURL(response);
        //         this.drawing = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        //     },
        //     (error) => {
        //         alert(
        //             `Votre requête pour récupérer le dessin sélectionné n'a pas pu être acheminé vers le serveur de PolyDessin. Veuillez réessayer.\n${error}`,
        //         );
        //     },
        // );
    }
}

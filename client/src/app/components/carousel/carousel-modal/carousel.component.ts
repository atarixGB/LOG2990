import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IndexService } from '@app/services/index/index.service';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
    drawing: SafeUrl;

    constructor(public indexService: IndexService, private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.getDrawings('test.png');
    }

    getDrawings(imageUrl: string): void {
        this.indexService.getDrawing(imageUrl).subscribe(
            (response) => {
                // Do what you want with the data here
                this.drawing = response;
                let objectURL = URL.createObjectURL(response);
                this.drawing = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            },
            (error) => {
                alert(
                    `Votre requête pour récupérer le dessin sélectionné n'a pas pu être acheminé vers le serveur de PolyDessin. Veuillez réessayer.\n${error}`,
                );
            },
        );
    }
}

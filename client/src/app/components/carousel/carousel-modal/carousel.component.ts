import { AfterViewInit, Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DrawingParams } from '@app/components/drawing/DrawingParams';
import { IndexService } from '@app/services/index/index.service';
import { Drawing } from '@common/communication/drawing';

enum Card {
    First = 1,
    Second = 2,
    Third = 3,
}
@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
    private index: number;
    private afterNext: boolean;
    private afterPrevious: boolean;
    private chosenURL: string;
    Card: typeof Card = Card;
    isLoading: boolean;
    imageCards: Drawing[];
    placement: Drawing[];
    isDisabled: boolean;
    filters: string[];
    tagInput: string;
    drawingCards: boolean[];

    @ViewChild('loadImageButton', { static: false }) loadImageButton: ElementRef<MatButton>;
    @ViewChild('recycleBin', { static: false }) recycleButton: ElementRef<MatButton>;

    constructor(
        public indexService: IndexService,
        private router: Router,
        private dialogRef: MatDialogRef<CarouselComponent>,
        @Inject(MAT_DIALOG_DATA) public isCanvaEmpty: boolean,
    ) {
        this.index = 0;
        this.imageCards = [];
        this.placement = [];
        this.filters = [];
        this.afterNext = false;
        this.afterPrevious = false;
        this.isLoading = true;
        this.chosenURL = '';
        this.isDisabled = true;
        this.tagInput = '';
        this.drawingCards = [false, false, false];
    }

    async ngAfterViewInit() {
        this.getDrawings();
    }

    getDrawings() {
        this.isLoading = true;
        this.indexService.getAllDrawings().then((drawings: Drawing[]) => {
            this.imageCards = drawings;
            this.isLoading = false;
            this.nextImages();
        });
    }

    async searchbyTags() {
        await this.indexService.searchByTags(this.filters).then((result) => {
            this.imageCards = result;
            this.nextImages();
        });
    }
    nextImages() {
        console.log('dans next');
        if (this.afterPrevious) {
            this.index++;
            this.afterPrevious = false;
        }
        for (let i = 0; i < 3; i++) {
            if (this.index > this.imageCards.length - 1) {
                this.index = 0;
            }
            this.placement[i] = this.imageCards[this.index];
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
                this.index = this.imageCards.length - 1;
            }
            console.log(this.index);
            this.placement[i] = this.imageCards[this.index];
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

    chosen(url: string) {
        this.chosenURL = url;
        this.isDisabled = false;
    }

    async deleteDrawing() {
        let pathname = (url: string): string => {
            let parseUrl = new URL(url).pathname;
            parseUrl = parseUrl.split('/')[4].split('.')[0];
            return parseUrl;
        };
        this.indexService.deleteDrawingById(pathname(this.chosenURL)).then(() => {
            this.getDrawings();
        });
    }

    loadImage() {
        if (!this.isCanvaEmpty) {
            let decision = confirm('Voulez-vous abandonner votre dessin ?');
            if (decision) {
                this.openDrawing();
            }
        } else {
            this.openDrawing();
        }
    }

    openDrawing(): void {
        const params: DrawingParams = {
            url: this.chosenURL,
        };
        this.router.navigate(['/'], { skipLocationChange: true }).then(() => this.router.navigate(['editor', params]));
        this.dialogRef.close();
    }

    addTag(): void {
        const trimmedTag: string = this.tagInput.trim();
        this.filters.push(trimmedTag);
        this.tagInput = '';
        this.searchbyTags();
    }

    removeTag(tag: string): void {
        this.filters = this.filters.filter((current) => current !== tag);
        this.searchbyTags();
    }

    changeStyle(card: Card) {
        if (card === Card.First) {
            this.drawingCards = [!this.drawingCards[0], false, false];
        }
        if (card === Card.Second) {
            this.drawingCards = [false, !this.drawingCards[1], false];
        }
        if (card === Card.Third) {
            this.drawingCards = [false, false, !this.drawingCards[2]];
        }
    }
}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Filters, ImageFormat } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/export-image/export.service'

// const MIN_INPUT_SIZE = 1;
const MAX_INPUT_SIZE = 15;
// const NB_TAGS_ALLOWED = 5;

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss']
})
export class ExportModalComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    
    matTooltipForTitle: string = `Le titre doit contenir seulement des caractères alphanumériques. Sa longueur doit être au plus de ${MAX_INPUT_SIZE} caractères.`;
    matTooltipForTags: string = `Le nom d'une étiquette doit contenir seulement des caractères alphanumériques. Sa longueur doit être au plus de ${MAX_INPUT_SIZE} caractères.`;
    drawingTitle: string;

    ImageFormat: typeof ImageFormat = ImageFormat;
    Filters: typeof Filters = Filters;

    private baseCtx: CanvasRenderingContext2D;

    constructor(
        public matDialogRef: MatDialogRef<ExportModalComponent>,
        public exportService: ExportService,
        private drawingService: DrawingService,
    ) {
        this.drawingTitle = 'dessin';
    }

    ngAfterViewInit(): void {

        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    imagePrevisualization(): void {
        let image = new Image();
        image.src = this.exportService.currentDrawing;

        image.onload = () => {
            this.baseCtx.drawImage(image, 0, 0, 400, 250);
        }
    }


    exportDrawing(): void{
      const image = new Image();
      image.src = this.drawingService.canvas.toDataURL("image/jpeg");
      // temp
      let title = this.drawingTitle;
      console.log(title);
      
    }
}


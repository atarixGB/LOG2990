import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FiltersList } from '@app/constants';
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
    FiltersList: typeof FiltersList = FiltersList;

    private baseCtx: CanvasRenderingContext2D;

    constructor(
        public matDialogRef: MatDialogRef<ExportModalComponent>,
        public exportService: ExportService,
    ) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.exportService.baseCtx = this.baseCtx;
        this.exportService.canvas = this.baseCanvas.nativeElement;
    }
}


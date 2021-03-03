import { Injectable } from '@angular/core';
import { FiltersList } from '@app/constants';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  baseCtx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  drawingTitle: string;
  currentDrawing: string;
  currentImageFormat: string;
  selectedFilter: FiltersList;
  currentFilter: string | undefined;
  filterIntensity: number;
  
  filtersBindings: Map<FiltersList, string>;
  
  private image: HTMLImageElement;
  
  constructor(private drawingService: DrawingService) {
    this.drawingTitle = 'mon-dessin'
    this.currentDrawing = '';
    this.currentImageFormat = 'png';
    this.selectedFilter = FiltersList.None;
    this.currentFilter = 'none';
    this.filterIntensity = 50;

    this.image = new Image();

    this.filtersBindings = new Map<FiltersList, string>();
        this.filtersBindings
            .set(FiltersList.None, 'none')
            .set(FiltersList.Blur, 'blur')
            .set(FiltersList.Brightness, 'brightness')
            .set(FiltersList.Contrast, 'contrast')
            .set(FiltersList.Invert, 'invert')
            .set(FiltersList.Grayscale, 'grayscale');
  }

  imagePrevisualization(): void{
    this.currentDrawing = this.drawingService.canvas.toDataURL();
    this.image.src = this.currentDrawing;

    this.image.onload = () => {
      this.baseCtx.drawImage(this.image, 0, 0, 400, 250);
    }
  }

  applyFilter(): void{
    if(this.filtersBindings.has(this.selectedFilter)){
      this.currentFilter = this.filtersBindings.get(this.selectedFilter);
    }
    
    if(this.currentFilter != undefined){
      this.image.src = this.currentDrawing;
      
      this.image.onload = () => {
        this.baseCtx.clearRect(0, 0, 400, 250);

        if(this.currentFilter === 'none') {
          this.baseCtx.filter = 'none';
        } else if (this.currentFilter === 'blur') {
          this.baseCtx.filter = this.currentFilter + '(' + this.filterIntensity + 'px)';
        } else {
          this.baseCtx.filter = this.currentFilter + '(' + this.filterIntensity + '%)';
        }
        
        this.baseCtx.drawImage(this.image, 0, 0, 400, 250);
      }
      
    }
  }

  exportDrawing(): void{
    const link = document.createElement('a');
    this.image.src = this.canvas.toDataURL("image/" + this.currentImageFormat);
    link.download = this.drawingTitle + '.' + this.currentImageFormat;
    link.href = this.image.src;
    link.click();
  }
}

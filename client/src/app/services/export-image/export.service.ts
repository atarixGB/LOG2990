import { Injectable } from '@angular/core';
import { ImageFormat, Filters } from '@app/constants';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  imageFormat: ImageFormat;
  filter: Filters;
  currentDrawing: string;

  constructor(private drawingService: DrawingService) {
    this.currentDrawing = '';
  }

  getCanvasDrawing(): void{
    console.log(this.currentDrawing);
    
    this.currentDrawing = this.drawingService.canvas.toDataURL();
  }

  exportDrawing(): void{

  }
}

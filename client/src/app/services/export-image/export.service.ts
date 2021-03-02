import { Injectable } from '@angular/core';
import { ImageFormat, Filters } from '@app/constants';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  baseCtx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  imageFormat: ImageFormat;
  filter: Filters;
  currentDrawing: string;

  constructor(private drawingService: DrawingService) {
    this.currentDrawing = '';
  }

  imagePrevisualization(): void{
    this.currentDrawing = this.drawingService.canvas.toDataURL();

    let image = new Image();
    image.src = this.currentDrawing;

    image.onload = () => {
      this.baseCtx.drawImage(image, 0, 0, 400, 250);
    }
  }

  exportDrawing(): void{

  }
}

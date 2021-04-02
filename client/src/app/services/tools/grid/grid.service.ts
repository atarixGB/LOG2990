import { Tool } from '@app/classes/tool';
import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class GridService extends Tool  {

  constructor(drawingService: DrawingService) {super(drawingService); }
}

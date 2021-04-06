import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_STAMP_SIZE, MouseButton, StampList } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class StampService extends Tool{

  imageCoords : Vec2;
  currentStamp: string;
  image :HTMLImageElement;
  size: number
  //imageURL:string;

  stampBindings: Map<StampList, string>;
  srcBinding: Map<string, string>;
  

  constructor(drawingService: DrawingService) {
    super(drawingService);

    this.stampBindings = new Map<StampList, string>();
        this.stampBindings
            .set(StampList.Heart, 'heart')
            .set(StampList.Star, 'star')
            .set(StampList.Hand, 'hand')
            .set(StampList.Paw, 'paw')
            .set(StampList.Smiley, 'smiley');

        this.srcBinding
            .set('heart', './client/src/app/Heart.png')
            .set('star', './client/src/app/star.png')
            .set('hand', './client/src/app/hand.png')
            .set('paw', './client/src/app/paw.png')
            .set('smiley', './client/src/app/smiley.png');

    this.currentStamp = 'favorite';
    this.size = DEFAULT_STAMP_SIZE;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    if (this.mouseDown) {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.imageCoords = this.mouseDownCoord;
        this.image = new Image(this.size, this.size);
        if(this.srcBinding.get(this.currentStamp) !== undefined){
          this.image.src = this.srcBinding.get(this.currentStamp)!;
        }
        this.drawStamp();
    }
  } 

  drawStamp(): void{
     this.drawingService.baseCtx.drawImage(this.image, this.imageCoords.x, this.imageCoords.y);
  }
  

}

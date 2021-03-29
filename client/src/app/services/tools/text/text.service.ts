import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';


@Injectable({
  providedIn: 'root'
})
export class TextService extends Tool{

    private textInput : string;

  constructor(drawingService: DrawingService) { 
    super(drawingService);
    this.textInput = "";
  }

  onMouseClick(event : MouseEvent): void{
      if(!this.mouseMove){
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.write(this.mouseDownCoord);
      }
      this.mouseMove = false;
  }

  handleKeyUp(event: KeyboardEvent): void{
      console.log('J écris');
      if(event.key === "BACKSPACE" && this.textInput !== ""){
        console.log('Problème backspace');
        this.textInput.slice(this.textInput.length-1);
      }
      else{
        this.textInput += event.key;
      }
      this.drawingService.previewCtx.fillStyle = 'black';
      this.drawingService.previewCtx.fillText(this.textInput, this.mouseDownCoord.x, this.mouseDownCoord.y);
  }

  write( mousePosition : Vec2) : void {
    //this.drawingService.previewCtx.clearRect(this.mouseDownCoord.x,this.mouseDownCoord.y,this.drawingService.previewCanvas.width, this.drawingService.previewCanvas.height);
    this.drawingService.baseCtx.fillStyle = 'black';
    this.drawingService.baseCtx.fillText(this.textInput, mousePosition.x, mousePosition.y);
    this.textInput = '';
  }




}

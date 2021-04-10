import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ANGLE_HALF_TURN, MAX_ANGLE, MouseButton, ROTATION_STEP_STAMP, SCALE_FACTOR_STAMP, StampList } from '@app/constants';
import { ColorOrder } from '@app/interfaces-enums/color-order';
import { ColorManagerService } from '@app/services/color-manager/color-manager.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StampService extends Tool{

  imageCoords : Vec2;
  currentStamp: string;
  selectStamp: StampList;
  imageSrc :string;
  size: number;
  color: string;
  angle: number;
  isKeyAltDown: boolean;
  mouseEvent: MouseEvent;

  private angleObservable: Subject<number> = new Subject<number>();

  stampBindings: Map<StampList, string>;
  srcBinding: Map<string, string>;
  

  constructor(drawingService: DrawingService, private colorManager: ColorManagerService) {
    super(drawingService);

    this.stampBindings = new Map<StampList, string>();
        this.stampBindings
            .set(StampList.Heart, 'heart')
            .set(StampList.Star, 'star')
            .set(StampList.Hand, 'hand')
            .set(StampList.Crown, 'crown')
            .set(StampList.Smiley, 'smiley');
    
    this.srcBinding = new Map<string, string>();
        this.srcBinding
            .set('heart', 'M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1   c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3   l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4   C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3   s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4   c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3   C444.801,187.101,434.001,213.101,414.401,232.701z')
            .set('star',  'M242.949,93.714c-0.882-2.715-3.229-4.694-6.054-5.104l-74.98-10.9l-33.53-67.941c-1.264-2.56-3.871-4.181-6.725-4.181  c-2.855,0-5.462,1.621-6.726,4.181L81.404,77.71L6.422,88.61C3.596,89.021,1.249,91,0.367,93.714  c-0.882,2.715-0.147,5.695,1.898,7.688l54.257,52.886L43.715,228.96c-0.482,2.814,0.674,5.658,2.983,7.335  c2.309,1.678,5.371,1.9,7.898,0.571l67.064-35.254l67.063,35.254c1.097,0.577,2.296,0.861,3.489,0.861c0.007,0,0.014,0,0.021,0  c0,0,0,0,0.001,0c4.142,0,7.5-3.358,7.5-7.5c0-0.629-0.078-1.24-0.223-1.824l-12.713-74.117l54.254-52.885  C243.096,99.41,243.832,96.429,242.949,93.714z M173.504,146.299c-1.768,1.723-2.575,4.206-2.157,6.639l10.906,63.581  l-57.102-30.018c-2.185-1.149-4.795-1.149-6.979,0l-57.103,30.018l10.906-63.581c0.418-2.433-0.389-4.915-2.157-6.639  l-46.199-45.031l63.847-9.281c2.443-0.355,4.555-1.889,5.647-4.103l28.55-57.849l28.55,57.849c1.092,2.213,3.204,3.748,5.646,4.103  l63.844,9.281L173.504,146.299z')
            .set('hand',  'M472.936,200.703c-5.177-5.177-11.293-9.069-17.959-11.538c13.349-19.462,11.398-46.338-5.88-63.617   c-5.425-5.425-11.799-9.336-18.592-11.742c4.674-7.716,7.175-16.583,7.175-25.836c0-13.356-5.201-25.912-14.646-35.355   c-9.443-9.444-21.999-14.645-35.355-14.645c-9.253,0-18.12,2.501-25.836,7.175c-2.406-6.792-6.316-13.167-11.741-18.592   c-19.496-19.494-51.217-19.495-70.711,0l-86.405,86.405c-2.481-6.326-6.251-12.135-11.2-17.084   c-9.444-9.444-22-14.645-35.355-14.645s-25.912,5.201-35.355,14.645L38.369,168.58C13.626,193.323,0,226.22,0,261.211   s13.626,67.888,38.369,92.631l83.438,83.438c24.742,24.743,57.639,38.37,92.63,38.37s67.889-13.626,92.631-38.37l165.867-165.866   c9.444-9.444,14.646-22,14.646-35.356C487.582,222.703,482.38,210.147,472.936,200.703z M451.723,250.201L285.856,416.067   c-19.076,19.077-44.44,29.583-71.418,29.583c-26.978,0-52.341-10.506-71.417-29.583l-83.438-83.438   c-39.38-39.38-39.38-103.456,0-142.836l72.707-72.706c3.777-3.777,8.799-5.858,14.142-5.858s10.364,2.081,14.142,5.858   c3.777,3.777,5.858,8.799,5.858,14.142s-2.081,10.364-5.858,14.142c0,0-56.568,56.569-56.568,56.569l21.213,21.213L300.604,47.766   c7.798-7.798,20.487-7.798,28.285,0s7.798,20.486,0,28.285L217.141,187.798l21.213,21.213L373.538,73.828   c3.777-3.777,8.8-5.858,14.142-5.858c5.343,0,10.365,2.081,14.143,5.858c3.777,3.777,5.858,8.8,5.858,14.142   c0,5.342-2.081,10.364-5.858,14.142l-23.426,23.426c-0.01,0.01-111.758,111.758-111.758,111.758l21.213,21.213l111.748-111.748   c7.798-7.798,20.487-7.798,28.285,0s7.798,20.487,0,28.285l-25.65,25.65c-0.008,0.008-86.098,86.097-86.098,86.097l21.213,21.213   l86.094-86.094c3.777-3.775,8.798-5.854,14.138-5.854c5.343,0,10.365,2.081,14.143,5.858c3.777,3.777,5.858,8.8,5.858,14.142   C457.582,241.4,455.5,246.423,451.723,250.201z')
            .set('crown',  'M60.049,4C57.816,4,56,5.816,56,8.048c0,1.183,0.519,2.239,1.331,2.979L40.691,24.685L33.094,7.943   c1.724-0.464,3.004-2.026,3.004-3.895C36.098,1.816,34.281,0,32.049,0S28,1.816,28,4.048c0,1.869,1.28,3.43,3.004,3.895   l-7.598,16.742L6.767,11.028c0.812-0.741,1.331-1.797,1.331-2.979C8.098,5.816,6.281,4,4.049,4S0,5.816,0,8.048   s1.816,4.048,4.049,4.048c0.362,0,0.707-0.063,1.041-0.153c0.007,0.03,0.004,0.061,0.014,0.092l9.528,29.091h-1.582   c-0.509,0-0.921,0.413-0.921,0.921v4c0,0.509,0.412,0.921,0.921,0.921h38c0.509,0,0.921-0.413,0.921-0.921v-4   c0-0.509-0.412-0.921-0.921-0.921h-1.582l9.528-29.091c0.01-0.03,0.007-0.061,0.014-0.092c0.334,0.09,0.679,0.153,1.041,0.153   c2.232,0,4.049-1.816,4.049-4.048S62.281,4,60.049,4z M2.098,8.048c0-1.076,0.875-1.952,1.951-1.952C5.125,6.097,6,6.972,6,8.048   C6,9.125,5.125,10,4.049,10C2.973,10,2.098,9.125,2.098,8.048z M50.128,45.127H13.97V42.97h36.158V45.127z M30.098,4.048   c0-1.076,0.875-1.952,1.951-1.952C33.125,2.097,34,2.972,34,4.048C34,5.124,33.125,6,32.049,6C30.973,6,30.098,5.124,30.098,4.048z    M47.396,41.053H16.701L8.058,14.663l15.087,12.383c0.24,0.197,0.558,0.271,0.857,0.2c0.302-0.07,0.553-0.276,0.681-0.558   l7.366-16.231l7.366,16.231c0.128,0.282,0.379,0.488,0.681,0.558c0.299,0.072,0.617-0.003,0.857-0.2L56.04,14.663L47.396,41.053z    M60.049,10c-1.076,0-1.951-0.875-1.951-1.952c0-1.076,0.875-1.952,1.951-1.952C61.125,6.097,62,6.972,62,8.048   C62,9.125,61.125,10,60.049,10z')
            .set('smiley', 'M90.546,15.518C69.858-5.172,36.2-5.172,15.516,15.513C-5.172,36.198-5.17,69.858,15.518,90.547   c20.682,20.684,54.34,20.684,75.026-0.004C111.23,69.858,111.228,36.2,90.546,15.518z M84.757,84.758   c-17.493,17.494-45.961,17.496-63.455,0.002c-17.498-17.497-17.495-45.966,0-63.46C38.796,3.807,67.262,3.805,84.759,21.302   C102.253,38.796,102.251,67.265,84.757,84.758z M33.299,44.364h-3.552c-0.313,0-0.604-0.18-0.738-0.459   c-0.055-0.112-0.082-0.236-0.082-0.358c0-0.184,0.062-0.363,0.175-0.507l7.695-9.755c0.158-0.196,0.392-0.308,0.645-0.308   s0.486,0.111,0.641,0.304l7.697,9.757c0.189,0.237,0.229,0.58,0.1,0.859c-0.146,0.293-0.428,0.467-0.741,0.467h-3.554   c-0.181,0-0.351-0.083-0.463-0.225l-3.68-4.664l-3.681,4.664C33.648,44.281,33.479,44.364,33.299,44.364z M77.898,43.038   c0.188,0.237,0.229,0.58,0.1,0.859c-0.146,0.293-0.428,0.467-0.741,0.467h-3.554c-0.181,0-0.352-0.083-0.463-0.225l-3.681-4.664   l-3.681,4.664c-0.112,0.141-0.281,0.225-0.462,0.225h-3.552c-0.313,0-0.604-0.18-0.738-0.459c-0.055-0.112-0.082-0.236-0.082-0.358   c0-0.184,0.062-0.363,0.175-0.507l7.695-9.755c0.158-0.196,0.392-0.308,0.645-0.308c0.254,0,0.486,0.111,0.642,0.304L77.898,43.038   z M76.016,64.068c-3.843,8.887-12.843,14.629-22.927,14.629c-10.301,0-19.354-5.771-23.064-14.703   c-0.636-1.529,0.089-3.285,1.62-3.921c0.376-0.155,0.766-0.229,1.149-0.229c1.176,0,2.292,0.695,2.771,1.85   c2.776,6.686,9.655,11.004,17.523,11.004c7.69,0,14.528-4.321,17.42-11.011c0.658-1.521,2.424-2.222,3.944-1.563   C75.974,60.781,76.674,62.548,76.016,64.068z');

    this.currentStamp = 'smiley';
    this.size = SCALE_FACTOR_STAMP;
    this.color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
    this.angle = 0;
    this.isKeyAltDown = false;
  }

  onMouseDown(event: MouseEvent): void {
    
    this.mouseDown = event.button === MouseButton.Left;
    if (this.mouseDown) {
        this.drawStamp(this.getPositionFromMouse(event));
    }
    
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Alt') {
        event.preventDefault();
        this.isKeyAltDown = true;
    }
  }

  onKeyUp(event: KeyboardEvent): void {
      if (event.key === 'Alt') {
          this.isKeyAltDown = false;
      }
  }
  
  onMouseMove(event: MouseEvent): void {
    this.mouseEvent = event;
    this.previewCursor(this.getPositionFromMouse(event));
  }

  onWheelEvent(event: WheelEvent): void {
      let rotationStep = ROTATION_STEP_STAMP;
      if (this.isKeyAltDown) {
            rotationStep = 1;
      }
      this.changeAngle(this.angle - (event.deltaY / Math.abs(event.deltaY)) * rotationStep);
      console.log('angle onWheel: ' , this.angle);
      this.onMouseMove(this.mouseEvent);
  }

  changeAngle(newAngle: number): void {
    newAngle %= MAX_ANGLE;
    if (newAngle < 0) {
        newAngle += MAX_ANGLE;
    }
    this.angle = newAngle;
    this.angleObservable.next(this.angle);
  }

  drawStamp(event:Vec2): void{
    if(this.srcBinding.has(this.currentStamp)){
      this.imageSrc = this.srcBinding.get(this.currentStamp)!;
    }
    
    const path = new Path2D(this.imageSrc);

    this.drawingService.baseCtx.rotate(-((this.angle * Math.PI) / ANGLE_HALF_TURN));

    this.drawingService.baseCtx.translate(event.x, event.y);
    this.drawingService.baseCtx.scale(this.size, this.size);
  
    this.color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
    this.drawingService.baseCtx.strokeStyle = this.color;
    this.drawingService.baseCtx.fillStyle = this.color;
    

    this.drawingService.baseCtx.stroke(path);
    this.drawingService.baseCtx.fill(path);
    
    this.drawingService.baseCtx.setTransform(1, 0, 0, 1, 0, 0);
    
  }

  previewCursor(event:Vec2):void{
    if(this.srcBinding.has(this.currentStamp)){
      this.imageSrc = this.srcBinding.get(this.currentStamp)!;
    }
    
    const path = new Path2D(this.imageSrc);

    
    //const center: Vec2 = { x: stampData.position.x, y: stampData.position.y };

    // Rotate stamp
    // ctx.translate(center.x, center.y);
    this.drawingService.cursorCtx.rotate(-((this.angle * Math.PI) / ANGLE_HALF_TURN));
    // ctx.translate(-center.x, -center.y);
    
    console.log('angle preview: ' , this.angle);
    
    // Move stamp center to cursor position
    this.drawingService.cursorCtx.translate(event.x, event.y);
    this.drawingService.cursorCtx.scale(this.size, this.size);

    
    // Print stamp on canvas
    this.color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
    this.drawingService.cursorCtx.strokeStyle = this.color;
    this.drawingService.cursorCtx.fillStyle = this.color;
    

    this.drawingService.cursorCtx.stroke(path);
    this.drawingService.cursorCtx.fill(path);
    //this.drawingService.cursorCtx.scale(stampData.size * SCALE_FACTOR, stampData.size * SCALE_FACTOR);
    this.drawingService.cursorCtx.setTransform(1, 0, 0, 1, 0, 0);
    
    
  }

  changeStamp(): void {
    if (this.stampBindings.has(this.selectStamp)) {
        this.currentStamp = this.stampBindings.get(this.selectStamp)!;
    }
  }

  

}

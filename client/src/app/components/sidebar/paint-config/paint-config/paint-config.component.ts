import { PaintBucketService } from './../../../../services/tools/paint-bucket/paint-bucket.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-paint-config',
  templateUrl: './paint-config.component.html',
  styleUrls: ['./paint-config.component.scss']
})
export class PaintConfigComponent  {
  tolerance: number;
  
  constructor(public paintBucketService:PaintBucketService) { 
    this.tolerance=paintBucketService.tolerance;
  }

  setToleranceValue(newValue:number){
    this.tolerance=newValue;
    this.paintBucketService.setToleranceValue(this.tolerance);
  }
  
}

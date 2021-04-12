import { MoveSelectionService } from '@app/services/tools/selection/move-selection.service';
import { SelectionBox } from './../../../../../constants';
import { Component } from '@angular/core';

@Component({
  selector: 'app-magnetism-config',
  templateUrl: './magnetism-config.component.html',
  styleUrls: ['./magnetism-config.component.scss']
})
export class MagnetismConfigComponent {
  anchorPoint:SelectionBox=1;
  isMagnetismEnabled: boolean = false;
  
  constructor(public moveSelectionService:MoveSelectionService) {
    this.isMagnetismEnabled=moveSelectionService.isMagnetism;
    this.anchorPoint=moveSelectionService.magnetismService.anchorPoint;
   }

   enableGridMagnetism(isChecked:boolean):void{
     this.isMagnetismEnabled=isChecked;
     this.moveSelectionService.enableMagnetism(isChecked);
   }

   

}

import { MagnetismService } from '@app/services/selection/magnetism.service';
import { MoveSelectionService } from '@app/services/selection/move-selection.service';
import { SelectionBox } from '@app/constants';
import { Component } from '@angular/core';

@Component({
  selector: 'app-magnetism-config',
  templateUrl: './magnetism-config.component.html',
  styleUrls: ['./magnetism-config.component.scss']
})
export class MagnetismConfigComponent {
  SelectionBox: typeof SelectionBox=SelectionBox;
  isMagnetismEnabled: boolean = false;
  magnetismService:MagnetismService;
  
  constructor(public moveSelectionService:MoveSelectionService) {
    this.isMagnetismEnabled=moveSelectionService.isMagnetism;
   }

   enableGridMagnetism(isChecked:boolean):void{
     this.isMagnetismEnabled=isChecked;
     this.moveSelectionService.isMagnetism=isChecked;
     this.moveSelectionService.enableMagnetism(isChecked);
    
   }

   

}

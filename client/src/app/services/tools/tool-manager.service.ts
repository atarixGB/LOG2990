import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolList } from '@app/constants';
import { LineService } from './line/line.service';
import { PencilService } from './pencil/pencil-service';

@Injectable({
  providedIn: 'root'
})
export class ToolManagerService {
  private currentTool: Tool;
  toolList: ToolList;

  constructor(private pencilService: PencilService, private lineService: LineService) {
    this.currentTool = this.pencilService;
  }

  getCurrentTool(): Tool {
    return this.currentTool;
  }

  switchTool(tool: ToolList): void {
    switch (tool) {
      case ToolList.Pencil: {
        this.currentTool = this.pencilService;
        break;
      }
      case ToolList.Line: {
        this.currentTool = this.lineService;
        break;
      }
    }

  }


}

import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolList } from '@app/constants';
import { EllipseService } from './ellipse/ellipse.service';
import { LineService } from './line/line.service';
import { PencilService } from './pencil/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    private currentTool: Tool;
    private currentToolEnum: ToolList;
    toolList: ToolList;

    constructor(private pencilService: PencilService, private lineService: LineService, private ellipseService: EllipseService) {
        this.currentTool = this.pencilService;
        this.currentToolEnum = ToolList.Pencil;
    }

    getCurrentTool(): Tool {
        return this.currentTool;
    }

    getCurrentToolEnum(): ToolList {
        return this.currentToolEnum;
    }

    setCurrentTool(tool: ToolList): void {
        this.switchTool(tool);
    }

    switchTool(tool: ToolList): void {
        switch (tool) {
            case ToolList.Pencil:
                this.currentTool = this.pencilService;
                this.currentToolEnum = ToolList.Pencil;
                break;

            case ToolList.Line:
                this.currentTool = this.lineService;
                this.currentToolEnum = ToolList.Line;
                break;

            case ToolList.Rectangle:
                // this.currentTool = this.rectangleService;
                // this.currentToolEnum = ToolList.Rectangle;
                break;

            case ToolList.Ellipse:
                this.currentTool = this.ellipseService;
                this.currentToolEnum = ToolList.Ellipse;
                break;

            case ToolList.Eraser:
                // this.currentTool = this.eraserService;
                // this.currentToolEnum = ToolList.Eraser;
                break;
        }
    }
}

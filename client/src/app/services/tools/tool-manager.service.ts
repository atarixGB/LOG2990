import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/constants';
import { EllipseService } from './ellipse/ellipse.service';
import { EraserService } from './eraser.service';
import { LineService } from './line/line.service';
import { PencilService } from './pencil/pencil-service';
import { RectangleService } from './rectangle/rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    private currentTool: Tool;
    private currentToolEnum: ToolList;
    mousePosition: Vec2;
    toolList: ToolList;

    constructor(
        private pencilService: PencilService,
        private lineService: LineService,
        private eraserService: EraserService,
        private ellipseService: EllipseService,
        private rectangleService: RectangleService,
    ) {
        this.currentTool = this.pencilService;
        this.currentToolEnum = ToolList.Pencil;
    }

    handleHotKeysShortcut(event: KeyboardEvent): void {
        switch (event.key) {
            case 'c':
                this.currentTool = this.pencilService;
                this.currentToolEnum = ToolList.Pencil;
                break;

            case 'a':
                // TODO aerosol
                break;

            case '1':
                this.currentTool = this.rectangleService;
                this.currentToolEnum = ToolList.Rectangle;
                break;

            case '2':
                this.currentTool = this.ellipseService;
                this.currentToolEnum = ToolList.Ellipse;
                break;

            case '3':
                // TODO Polygone
                break;

            case 'l':
                this.currentTool = this.lineService;
                this.currentToolEnum = ToolList.Line;
                break;

            case 't':
                // TODO outil texte
                break;

            case 'b':
                // TODO sceau de peinture
                break;

            case 'e':
                this.currentTool = this.eraserService;
                this.currentToolEnum = ToolList.Eraser;
                break;
            case 'd':
                // TODO etampe
                break;

            case 'i':
                // TODO pipette
                break;

            // case 'r':
            //     // TODO rectangle de selection
            //     break;
            // case 's':
            //     // TODO ellipse de selection
            //     break;
            case 'v':
                // TODO lasso polygonal
                break;

            case 'Shift':
                if (this.currentTool === this.ellipseService) {
                    this.currentTool.mouseCoord = this.mousePosition;
                    this.currentTool.handleKeyDown(event);
                }
                break;
        }
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
                this.currentTool = this.rectangleService;
                this.currentToolEnum = ToolList.Rectangle;
                break;

            case ToolList.Ellipse:
                this.currentTool = this.ellipseService;
                this.currentToolEnum = ToolList.Ellipse;
                break;

            case ToolList.Eraser:
                this.currentTool = this.eraserService;
                this.currentToolEnum = ToolList.Eraser;
                break;
        }
    }
}

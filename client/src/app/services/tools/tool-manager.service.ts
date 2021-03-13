import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/constants';
import { SprayService } from '@app/services/tools/spray/spray.service';
import { EllipseService } from './ellipse/ellipse.service';
import { EraserService } from './eraser/eraser.service';
import { LineService } from './line/line.service';
import { PencilService } from './pencil/pencil-service';
import { RectangleService } from './rectangle/rectangle.service';
import { PolygonService } from './polygon/polygon.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    toolList: ToolList;
    currentTool: Tool | undefined;
    currentToolEnum: ToolList | undefined;

    serviceBindings: Map<ToolList, Tool>;
    keyBindings: Map<string, Tool>;

    constructor(
        private pencilService: PencilService,
        private lineService: LineService,
        private eraserService: EraserService,
        private ellipseService: EllipseService,
        private rectangleService: RectangleService,
<<<<<<< HEAD
        private polygonService: PolygonService,
=======
        private sprayService: SprayService,
>>>>>>> 1c2f21b79b25a20414730eb6f86944a423cb5fa0
    ) {
        this.currentTool = this.pencilService;
        this.currentToolEnum = ToolList.Pencil;

        this.serviceBindings = new Map<ToolList, Tool>();
        this.serviceBindings
            .set(ToolList.Pencil, this.pencilService)
            .set(ToolList.Ellipse, this.ellipseService)
            .set(ToolList.Rectangle, this.rectangleService)
            .set(ToolList.Polygon, this.polygonService)
            .set(ToolList.Eraser, this.eraserService)
            .set(ToolList.Line, this.lineService)
            .set(ToolList.Spray, this.sprayService);

        this.keyBindings = new Map<string, Tool>();
        this.keyBindings
            .set('c', this.pencilService)
            .set('1', this.rectangleService)
            .set('2', this.ellipseService)
            .set('l', this.lineService)
            .set('e', this.eraserService)
<<<<<<< HEAD
            .set('3', this.polygonService);
=======
            .set('a', this.sprayService);
>>>>>>> 1c2f21b79b25a20414730eb6f86944a423cb5fa0
    }

    private getEnumFromMap(map: Map<ToolList, Tool>, searchValue: Tool | undefined): ToolList | undefined {
        for (const [key, value] of map.entries()) {
            if (value === searchValue) return key;
        }
        return undefined;
    }

    handleHotKeysShortcut(event: KeyboardEvent): void {
        if (this.currentTool && (event.key === 'Shift' || event.key === 'Backspace' || event.key === 'Escape')) {
            this.currentTool.handleKeyDown(event);
        } else {
            this.switchToolWithKeys(event.key);
        }
    }

    switchToolWithKeys(keyShortcut: string): void {
        if (this.keyBindings.has(keyShortcut)) {
            this.currentTool = this.keyBindings.get(keyShortcut);
            this.currentToolEnum = this.getEnumFromMap(this.serviceBindings, this.currentTool);
        }
    }

    switchTool(tool: ToolList): void {
        if (this.serviceBindings.has(tool)) {
            this.currentTool = this.serviceBindings.get(tool);
            this.currentToolEnum = tool;
        }
    }

    onMouseMove(event: MouseEvent, mouseCoord: Vec2): void {
        if (this.currentTool) {
            this.currentTool.mouseCoord = mouseCoord;
            this.currentTool.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent, mouseCoord: Vec2): void {
        if (this.currentTool) {
            this.currentTool.mouseCoord = mouseCoord;
            this.currentTool.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent, mouseCoord: Vec2): void {
        if (this.currentTool) {
            this.currentTool.mouseCoord = mouseCoord;
            this.currentTool.onMouseUp(event);
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (this.currentTool) {
            this.currentTool.onMouseClick(event);
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (this.currentTool) {
            this.currentTool.onMouseDoubleClick(event);
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (this.currentTool) {
            this.currentTool.handleKeyUp(event);
        }
    }
}

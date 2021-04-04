import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import {
    ACCEPTED_CHAR,
    CanvasType,
    DEFAULT_EMPHASIS,
    DEFAULT_FONT,
    DEFAULT_TEXT_ALIGN,
    DEFAULT_TEXT_SIZE,
    Emphasis,
    Font,
    TextAlign,
} from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    textInput: string[];
    currentLine: number;
    totalLine: number;
    cursorPosition: number;
    isWriting: boolean;
    positionText: Vec2;

    selectFont: Font;
    selectEmphasis: Emphasis;
    selectAlign: TextAlign;

    fontBinding: Map<Font, string>;
    emphasisBinding: Map<Emphasis, string>;
    alignBinding: Map<TextAlign, string>;

    color: string;
    font: string = DEFAULT_FONT;
    size: string = DEFAULT_TEXT_SIZE;
    emphasis: string = DEFAULT_EMPHASIS;
    align: string = DEFAULT_TEXT_ALIGN;

    constructor(drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);
        this.currentLine = 0;
        this.textInput = [];
        this.totalLine = 1;

        this.fontBinding = new Map<Font, string>();
        this.fontBinding
            .set(Font.Arial, 'Arial')
            .set(Font.TimesNewRoman, 'Times New Roman')
            .set(Font.ComicSansMs, 'Comic Sans Ms')
            .set(Font.CourierNew, 'Courier New')
            .set(Font.Impact, 'Impact');

        this.emphasisBinding = new Map<Emphasis, string>();
        this.emphasisBinding
            .set(Emphasis.Bold, 'bold')
            .set(Emphasis.Italic, 'italic')
            .set(Emphasis.ItalicBold, 'bold italic')
            .set(Emphasis.Normal, 'normal');

        this.alignBinding = new Map<TextAlign, string>();
        this.alignBinding.set(TextAlign.Left, 'left').set(TextAlign.Center, 'center').set(TextAlign.Right, 'right');

        this.cursorPosition = 0;
        this.isWriting = false;

        this.selectFont = Font.Arial;
        this.selectEmphasis = Emphasis.Normal;
        this.selectAlign = TextAlign.Left;
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isWriting === false) {
            console.log('Premier');
            this.textInput[this.currentLine] = '|';

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.positionText = this.mouseDownCoord;

            this.isWriting = true;

            this.writeOnCanvas(CanvasType.previewCtx);
        } else if (this.isWriting === true) {
            console.log('Deuxième');

            this.write();
            this.cursorPosition = 0;
            this.textInput = [''];
            this.currentLine = 0;
            this.totalLine = 1;
            this.isWriting = false;
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        console.log('Position curseur Début key ', this.cursorPosition);
        if (this.isWriting && event.key) {
            if (event.key === 'Backspace') {
                if (this.cursorPosition != 0 || (this.cursorPosition != 0 && this.currentLine != 0)) {
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition - 1) +
                        this.textInput[this.currentLine].substring(this.cursorPosition, this.textInput[this.currentLine].length);
                    this.cursorPosition--;
                }
            } else if (event.key === 'Delete') {
                this.textInput[this.currentLine] =
                    this.textInput[this.currentLine].substring(0, this.cursorPosition + 1) +
                    this.textInput[this.currentLine].substring(this.cursorPosition + 2, this.textInput[this.currentLine].length);
            } else if (event.key === 'ArrowLeft') {
                if (this.cursorPosition != 0) {
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        this.textInput[this.currentLine].substring(this.cursorPosition + 1, this.textInput[this.currentLine].length);
                    this.cursorPosition--;
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        '|' +
                        this.textInput[this.currentLine].substring(this.cursorPosition, this.textInput[this.currentLine].length);
                }
            } else if (event.key === 'ArrowRight') {
                if (this.cursorPosition != this.textInput[this.currentLine].length) {
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        this.textInput[this.currentLine].substring(this.cursorPosition + 1, this.textInput[this.currentLine].length);
                    this.cursorPosition++;
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        '|' +
                        this.textInput[this.currentLine].substring(this.cursorPosition, this.textInput[this.currentLine].length);
                }
            } else if (event.key === 'ArrowUp') {
                if (this.currentLine != 0) {
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        this.textInput[this.currentLine].substring(this.cursorPosition + 1, this.textInput[this.currentLine].length);
                    this.currentLine--;
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        '|' +
                        this.textInput[this.currentLine].substring(this.cursorPosition, this.textInput[this.currentLine].length);
                }
            } else if (event.key === 'ArrowDown') {
                if (this.currentLine != this.totalLine - 1) {
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        this.textInput[this.currentLine].substring(this.cursorPosition + 1, this.textInput[this.currentLine].length);
                    this.currentLine++;
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        '|' +
                        this.textInput[this.currentLine].substring(this.cursorPosition, this.textInput[this.currentLine].length);
                }
            } else if (event.key === 'Enter') {
                let nextLine = this.textInput[this.currentLine].substring(this.cursorPosition + 1, this.textInput[this.currentLine].length);
                this.textInput[this.currentLine] = this.textInput[this.currentLine].substring(0, this.cursorPosition);
                this.currentLine++;
                this.totalLine++;
                console.log('ici');

                this.textInput[this.currentLine] = nextLine + '|';
                this.cursorPosition = this.textInput[this.currentLine].length - 1;
            } else if (event.key === 'Escape') {
                this.textInput = [''];
                this.cursorPosition = 0;
                this.isWriting = false;
            } else if (this.cursorPosition != 0) {
                if (ACCEPTED_CHAR.test(event.key)) {
                    this.textInput[this.currentLine] =
                        this.textInput[this.currentLine].substring(0, this.cursorPosition) +
                        event.key +
                        this.textInput[this.currentLine].substring(this.cursorPosition, this.textInput[this.currentLine].length);
                    this.cursorPosition++;
                } else {
                    console.log('oh non');
                }
            } else {
                if (ACCEPTED_CHAR.test(event.key)) {
                    this.textInput[this.currentLine] = event.key + this.textInput[this.currentLine];
                    this.cursorPosition++;
                } else {
                    console.log('oh non');
                }
            }

            this.writeOnCanvas(CanvasType.previewCtx);
        }

        console.log(this.textInput);
        console.log('Position curseur fin key ', this.cursorPosition);
        console.log(event.key);
    }

    write(): void {
        this.textInput[this.currentLine] =
            this.textInput[this.currentLine].substring(0, this.cursorPosition) +
            this.textInput[this.currentLine].substring(this.cursorPosition + 1, this.textInput[this.currentLine].length);

        this.writeOnCanvas(CanvasType.baseCtx);
    }

    private writeOnCanvas(ctx: CanvasType): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (ctx == CanvasType.baseCtx) {
            this.color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;

            this.drawingService.baseCtx.fillStyle = this.color;
            this.drawingService.baseCtx.font = this.emphasis + ' ' + this.size + 'px ' + this.font;
            this.drawingService.baseCtx.textAlign = this.align as CanvasTextAlign;

            let y = this.positionText.y;

            for (let i = 0; i < this.totalLine; i++) {
                this.drawingService.baseCtx.fillText(this.textInput[i], this.mouseDownCoord.x, y);
                y += Number(this.size);
            }
        } else {
            this.color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;

            this.drawingService.previewCtx.fillStyle = this.color;
            this.drawingService.previewCtx.font = this.emphasis + ' ' + this.size + 'px ' + this.font;
            this.drawingService.previewCtx.textAlign = this.align as CanvasTextAlign;

            let y = this.positionText.y;

            for (let i = 0; i < this.totalLine; i++) {
                this.drawingService.previewCtx.fillText(this.textInput[i], this.mouseDownCoord.x, y);
                y += Number(this.size);
            }
        }
    }

    changeFont(): void {
        if (this.fontBinding.has(this.selectFont) && this.selectFont != undefined) {
            this.font = this.fontBinding.get(this.selectFont)!;
        }
    }

    changeEmphasis(): void {
        if (this.emphasisBinding.has(this.selectEmphasis) && this.selectEmphasis != undefined) {
            this.emphasis = this.emphasisBinding.get(this.selectEmphasis)!;
        }
    }

    changeAlign(): void {
        if (this.alignBinding.has(this.selectAlign) && this.selectAlign != undefined) {
            this.align = this.alignBinding.get(this.selectAlign)!;
        }
    }
}

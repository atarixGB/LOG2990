import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CanvasType, DEFAULT_FONT, DEFAULT_TEXT_SIZE, Font } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

@Injectable({
    providedIn: 'root',
})

export class TextService extends Tool {
    textInput: string;
    cursorPosition: number;
    isWriting: boolean;
    positionText: Vec2;
    font : string = DEFAULT_FONT;

    selectFont: Font;

    color: string;
    fontBinding: Map<Font, string>;
    size: string = DEFAULT_TEXT_SIZE;

    constructor(drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);
        
        this.fontBinding = new Map<Font, string>();
        this.fontBinding
            .set(Font.Arial, 'Arial')
            .set(Font.TimesNewRoman, 'Times New Roman')
            .set(Font.ComicSansMs, 'Comic Sans Ms')
            .set(Font.CourierNew, 'Courier New')
            .set(Font.Impact, 'Impact')

        
        this.textInput = '';
        this.cursorPosition = 0;
        this.isWriting = false;
    
    }

    onMouseDown(event: MouseEvent): void {
        // Premier clic -> Écrire temporairement sur le Preview 
        if (this.isWriting === false) {
            console.log('Premier');
            this.textInput = '|';
            // Position du début du texte
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.positionText = this.mouseDownCoord;
            // Propriétés
            this.color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
            // On est en train d'écrire
            this.isWriting = true;
            
            this.writeOnCanvas(CanvasType.previewCtx);

        // Deuxième clic -> Écrire définitivement sur le base
        } else if(this.isWriting === true){
            console.log('Deuxième');
            // Écrire sur le base canvas
            this.write();

            this.cursorPosition = 0;
            this.textInput = '';
            // On est prêt pour un autre texte ailleurs 
            this.isWriting = false;
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if(this.isWriting){
            // Backspace -> effacer le charactère cureur - 1
            if (event.key === 'Backspace') {
                if(this.cursorPosition != 0){
                    this.textInput = [this.textInput.substring(0, this.cursorPosition - 1), this.textInput.substring(this.cursorPosition + 1, this.textInput.length - 1)].join('');
                    this.cursorPosition--;
                }
            }
            // Delete -> effacer le charactère curseur + 1 
            else if(event.key === 'Delete'){
                this.textInput = [this.textInput.substring(0, this.textInput.length - 1), this.textInput.substring(this.textInput.length - 1)].join('');  
            }
            // Arrow Left -> curseur = curseur - 1 
            else if(event.key === 'ArrowLeft'){
                if(this.cursorPosition != 0){
                    this.textInput = this.textInput.substring(0, this.cursorPosition) + this.textInput.substring(this.cursorPosition + 1, this.textInput.length);
                    this.cursorPosition--;
                    this.textInput = this.textInput.substring(0, this.cursorPosition) + '|' + this.textInput.substring(this.cursorPosition, this.textInput.length);

                }
            }
            // Arrow Left -> curseur = curseur + 1
            else if(event.key === 'ArrowRight'){
                if(this.cursorPosition != this.textInput.length){
                    this.textInput = this.textInput.substring(0, this.cursorPosition) + this.textInput.substring(this.cursorPosition + 1, this.textInput.length);
                    this.cursorPosition++;
                    this.textInput = this.textInput.substring(0, this.cursorPosition) + '|' + this.textInput.substring(this.cursorPosition, this.textInput.length);
                }
            }
            // Enter -> changement de ligne
            else if(event.key === 'Enter'){
                
            }
            // Escape -> annuler
            else if(event.key === 'Escape'){
                this.textInput = '';
                this.cursorPosition = 0;
                this.isWriting = false;
            }
            // Ajout d'un caractère normal
            else if(this.cursorPosition != 0){
                this.textInput = this.textInput.substring(0, this.cursorPosition) + event.key + this.textInput.substring(this.cursorPosition + 1, this.textInput.length - 1);
                this.cursorPosition++;
            }
            
            else{
                this.textInput = event.key + this.textInput;
                this.cursorPosition++;
            }
            
            // Afficher sur le preview canvas 
            this.writeOnCanvas(CanvasType.previewCtx);
        }
        console.log(this.textInput); 
        
    }

    write(): void {
        this.textInput = this.textInput.substring(0, this.cursorPosition) + this.textInput.substring(this.cursorPosition, this.textInput.length - 1);

        this.writeOnCanvas(CanvasType.baseCtx);
    }

    private writeOnCanvas(ctx: CanvasType): void{
    
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if(ctx == CanvasType.baseCtx){
            this.drawingService.baseCtx.fillStyle = this.color;
            this.drawingService.baseCtx.font = this.size+ "px " + this.font;

            this.drawingService.baseCtx.fillText(this.textInput, this.mouseDownCoord.x, this.mouseDownCoord.y);
        }
        else {
            this.drawingService.previewCtx.fillStyle = this.color;
            this.drawingService.previewCtx.font = this.size+ "px " + this.font;
            console.log('FOnt write preview :' , this.font);
            this.drawingService.previewCtx.fillText(this.textInput, this.mouseDownCoord.x, this.mouseDownCoord.y);
        }

    }

    changeType(): void {
        if (this.fontBinding.has(this.selectFont) && this.selectFont != undefined) {
            this.font = this.fontBinding.get(this.selectFont)!;
            console.log('FOnt change type :' , this.font);
        }
    }
}

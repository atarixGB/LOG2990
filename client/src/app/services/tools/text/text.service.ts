import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { Font } from '@app/constants';
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
    font : string;

    color: string;
    filtersBindings: Map<Font, string>;

    constructor(drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);
        
        this.filtersBindings = new Map<Font, string>();
        this.filtersBindings
            .set(Font.Arial, 'Arial')
            .set(Font.TimesNewRoman, 'Times New Roman')
            .set(Font.CopperPlate, 'Copper Plate')
            .set(Font.CourierNew, 'Courier New')
            .set(Font.LucidaHandwriting, 'Lucida Handwriting')

        
        this.textInput = '|';
        this.cursorPosition = 0;
        this.isWriting = false;
    
    }

    onMouseDown(event: MouseEvent): void {
        // Premier clic -> Écrire temporairement sur le Preview 
        if (!this.mouseMove && this.isWriting === false) {
            // Position du début du texte
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.positionText = this.mouseDownCoord;
            // Propriétés
            this.color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
            // On est en train d'écrire
            this.isWriting = true;

        // Deuxième clic -> Écrire définitivement sur le base
        }else if(!this.mouseMove && this.isWriting === true){
            // Écrire sur le base canvas
            this.write();

            // On est prêt pour un autre texte ailleurs 
            this.isWriting = false;
        }
        this.mouseMove = false;
    }

    handleKeyUp(event: KeyboardEvent): void {
        // Backspace -> effacer le charactère cureur - 1
        if (event.key === 'Backspace' && this.cursorPosition != 0) {
            this.textInput = [this.textInput.substring(0, this.cursorPosition), this.textInput.substring(this.cursorPosition + 1, this.textInput.length - 1)].join('');
        }
        // Delete -> effacer le charactère curseur + 1 
        else if(event.key === 'Delete'){
            this.textInput = [this.textInput.substring(0, this.textInput.length - 1), this.textInput.substring(this.textInput.length - 1)].join('');  
        }
        // Arrow Left -> curseur = curseur - 1 
        else if(event.key === 'ArrowLeft'){
            
        }
        // Arrow Left -> curseur = curseur + 1
        else if(event.key === 'ArrowRight'){
            
        }
        // Enter -> changement de ligne
        else if(event.key === 'Enter'){
            
        }
        // Escape -> annuler
        else if(event.key === 'Escape'){
            
        }
        // Ajout d'un caractère normal
        else if(this.cursorPosition != 0){
            this.textInput = [this.textInput.substring(0, this.cursorPosition - 1), event.key, this.textInput.substring(this.cursorPosition, this.textInput.length - 1)].join('');
            this.cursorPosition++;
        }
        else{
            this.textInput = [event.key, this.textInput].join('');
            this.cursorPosition++;
        }

        // Afficher sur le preview canvas 
        this.drawingService.previewCtx.fillStyle = this.color;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.fillText(this.textInput, this.mouseDownCoord.x, this.mouseDownCoord.y);
    }

    write(): void {
        // Efface preview canvas
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // Effacer le curseur du texte à écrire
        
        
        // Propriétés du texte
        this.drawingService.baseCtx.fillStyle = this.color;

        // Écrire sur le base canvas
        this.drawingService.baseCtx.fillText(this.textInput, this.positionText.x, this.positionText.y);

        // Réinitialiser
        this.textInput = '|';
    }
}

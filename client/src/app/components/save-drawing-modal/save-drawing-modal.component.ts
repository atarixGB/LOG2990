import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';
import { Message } from '@common/communication/message';

const MIN_INPUT_SIZE = 1;
const MAX_INPUT_SIZE = 15;
const NB_TAGS_ALLOWED = 5;

@Component({
    selector: 'app-save-drawing-modal',
    templateUrl: './save-drawing-modal.component.html',
    styleUrls: ['./save-drawing-modal.component.scss'],
})
export class SaveDrawingModalComponent {
    matTooltipForTitle: string = `Le titre doit contenir seulement des caractères alphanumériques. Sa longueur doit être au plus de ${MAX_INPUT_SIZE} caractères.`;
    matTooltipForTags: string = `Le nom d'une étiquette doit contenir seulement des caractères alphanumériques. Sa longueur doit être au plus de ${MAX_INPUT_SIZE} caractères.`;
    minLength: number;
    maxLength: number;
    drawingTitle: string;
    tagsInput: string;

    constructor(
        public matDialogRef: MatDialogRef<SaveDrawingModalComponent>,
        private indexService: IndexService,
        private drawingService: DrawingService,
    ) {
        this.minLength = MIN_INPUT_SIZE;
        this.maxLength = MAX_INPUT_SIZE;
        this.drawingTitle = '';
        this.tagsInput = '';
    }

    sendServerTest(): void {
        const tags: string[] = this.parseTags(this.tagsInput);
        const inputAreValid: boolean = this.validateString(this.drawingTitle) && this.validateTags(tags);

        if (inputAreValid) {
            const message: Message = {
                title: this.drawingTitle,
                labels: tags,
                body: this.drawingService.canvas.toDataURL(),
            };

            this.indexService.basicPost(message).subscribe();
            this.matDialogRef.close();
            alert('Le dessin "' + this.drawingTitle + '" a bien été sauvegardé sur le serveur de PolyDessin !'); // temporaire
        } else {
            alert('pas ok'); // temporaire
        }
    }

    private validateString(str: string): boolean {
        const regex = /^[a-zA-Z0-9]+$/i;
        const isValidSize = str.length >= MIN_INPUT_SIZE && str.length <= MAX_INPUT_SIZE;
        const isAlphanumeric = regex.test(str);
        return isValidSize && isAlphanumeric;
    }

    private validateTags(tags: string[]): boolean {
        for (const tag of tags) {
            console.log(tag, this.validateString(tag));
            if (!this.validateString(tag)) return false;
        }
        return true;
    }

    private parseTags(str: string): string[] {
        return str.split(' ');
    }
}

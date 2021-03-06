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
    titleIsValid: boolean;
    tagInput: string;
    tags: string[];
    message: Message;

    constructor(
        public matDialogRef: MatDialogRef<SaveDrawingModalComponent>,
        private indexService: IndexService,
        private drawingService: DrawingService,
    ) {
        this.minLength = MIN_INPUT_SIZE;
        this.maxLength = MAX_INPUT_SIZE;
        this.drawingTitle = '';
        this.titleIsValid = false;
        this.tagInput = '';
        this.tags = [];
    }

    sendToServer(): boolean {
        this.titleIsValid = this.validateString(this.drawingTitle);

        if (this.titleIsValid) {
            this.message = {
                title: this.drawingTitle,
                labels: this.tags,
                body: this.drawingService.canvas.toDataURL(),
            };

            this.indexService.basicPost(this.message).subscribe();
            this.matDialogRef.close();
            alert('Le dessin "' + this.drawingTitle + '" a bien été sauvegardé sur le serveur de PolyDessin !'); // temporaire
            return true;
        } else {
            alert('Il y a une erreur avec les entrées. Veuillez revérifier le titre ou les étiquettes :)'); // temporaire
            return false;
        }
    }

    addTag(): void {
        if (this.tagInput && this.validateNumberOfTags() && this.validateString(this.tagInput) && !this.validateTagDuplicate()) {
            const trimmedTag: string = this.tagInput.trim();
            this.tags.push(trimmedTag);
            this.tagInput = '';
        }
    }

    removeTag(tag: string): void {
        this.tags = this.tags.filter((current) => current !== tag);
    }

    validateString(str: string): boolean {
        const regex = /^[a-z0-9]+$/i;
        const isAlphanumeric = regex.test(str);
        const isValidSize = str.length >= MIN_INPUT_SIZE && str.length <= MAX_INPUT_SIZE;
        return isValidSize && isAlphanumeric;
    }

    isStringEmpty(str: string): boolean {
        return str === '';
    }

    validateTagDuplicate(): boolean {
        for (const t in this.tags) {
            if (this.tags[t] === this.tagInput) return true;
        }
        return false;
    }

    private validateNumberOfTags(): boolean {
        const size = this.tags.length;
        return size >= 0 && size < NB_TAGS_ALLOWED;
    }
}

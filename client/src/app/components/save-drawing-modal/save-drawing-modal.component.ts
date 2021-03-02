import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IndexService } from '@app/services/index/index.service';
import { Message } from '@common/communication/message';

@Component({
    selector: 'app-save-drawing-modal',
    templateUrl: './save-drawing-modal.component.html',
    styleUrls: ['./save-drawing-modal.component.scss'],
})
export class SaveDrawingModalComponent {
    drawingTitle: string;
    tagsInput: string;

    constructor(public matDialogRef: MatDialogRef<SaveDrawingModalComponent>, private indexService: IndexService) {}

    sendServerTest(): void {
        const message: Message = {
            title: this.drawingTitle,
            labels: this.parseTags(this.tagsInput),
            body: 'Image data here',
        };

        this.indexService.basicPost(message).subscribe();
        this.matDialogRef.close();

        // TODO: Display message to user to confirm that drawing has been saved.
    }

    validateDrawingTitle(): boolean {
        // TODO
        return false;
    }

    parseTags(tags: string): string[] {
        return tags.split(' ');
    }
}

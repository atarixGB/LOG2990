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

    constructor(public matDialogRef: MatDialogRef<SaveDrawingModalComponent>, private indexService: IndexService) {}

    sendServerTest(): void {
        const message: Message = {
            title: 'YOO',
            body: 'Buddy',
        };

        this.indexService.basicPost(message).subscribe();
    }
}

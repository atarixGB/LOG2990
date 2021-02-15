import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
@Component({
    selector: 'app-new-draw-modal',
    templateUrl: './new-draw-modal.component.html',
    styleUrls: ['./new-draw-modal.component.scss'],
})
export class NewDrawModalComponent {
    constructor(private newDrawingService: NewDrawingService, public dialogRef: MatDialogRef<NewDrawModalComponent>) {}

    handleConfirm(): void {
        this.newDrawingService.clearCanva();
        this.dialogRef.close();
    }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExportModalComponent } from '@app/components/export-modal/export-modal.component';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';

@Component({
    selector: 'app-file-menu',
    templateUrl: './file-menu.component.html',
    styleUrls: ['./file-menu.component.scss'],
})
export class FileMenuComponent {
    constructor(public dialog: MatDialog) {}

    handleCreateDraw(): void {
        this.dialog.open(NewDrawModalComponent, {});
    }
    handleExportDrawing(): void {
        this.dialog.open(ExportModalComponent, {});
    }
}

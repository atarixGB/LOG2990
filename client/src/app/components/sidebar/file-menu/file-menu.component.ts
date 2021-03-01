import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';
import { SaveDrawingModalComponent } from '@app/components/save-drawing-modal/save-drawing-modal.component';
import { IndexService } from '@app/services/index/index.service';
import { BehaviorSubject } from 'rxjs';
@Component({
    selector: 'app-file-menu',
    templateUrl: './file-menu.component.html',
    styleUrls: ['./file-menu.component.scss'],
})
export class FileMenuComponent {
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(public dialog: MatDialog, public indexService: IndexService) {}

    handleCreateDraw(): void {
        this.dialog.open(NewDrawModalComponent, {});
    }

    handleSaveDrawing(): void {
        this.dialog.open(SaveDrawingModalComponent, {});
    }
}

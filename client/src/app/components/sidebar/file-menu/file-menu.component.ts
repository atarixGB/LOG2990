import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';
import { IndexService } from '@app/services/index/index.service';
import { Message } from '@common/communication/message';
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

    sendServerTest(): void {
        const message: Message = {
            title: 'YOO',
            body: 'Buddy',
        };

        this.indexService.basicPost(message).subscribe();
    }
}

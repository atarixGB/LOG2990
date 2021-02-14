import { Component } from '@angular/core';

@Component({
    selector: 'app-file-menu',
    templateUrl: './file-menu.component.html',
    styleUrls: ['./file-menu.component.scss'],
})
export class FileMenuComponent {
    constructor() {}
    openConfirmModal(): void {
        console.log('open a dialog');
    }
}

import { Component } from '@angular/core';
import { ToolList } from '@app/constants';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-config-panel',
    templateUrl: './config-panel.component.html',
    styleUrls: ['./config-panel.component.scss'],
})
export class ConfigPanelComponent {
    ToolList: typeof ToolList = ToolList;
    isOpened: boolean = true;

    constructor(public toolManagerService: ToolManagerService) {}

    closePanel(): void {
        this.isOpened = false;
        console.log('close');
    }
}

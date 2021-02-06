import { Component } from '@angular/core';
import { ToolList } from '@app/constants';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(public toolManagerService: ToolManagerService) {}

    ToolList = ToolList;
}

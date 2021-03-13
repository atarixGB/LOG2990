import { Component } from '@angular/core';
import { ToolList } from '@app/constants';
import { IndexService } from '@app/services/index/index.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService, public indexService: IndexService) {}

    getDrawings(): void {
        this.indexService.basicGet().subscribe((data) => {
            console.log(data);
        });
    }
}

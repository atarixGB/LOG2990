import { Component } from '@angular/core';
import { SelectionBox } from '@app/constants';
import { ClipboardService } from '@app/services/selection/clipboard.service';
import { MagnetismService } from '@app/services/selection/magnetism.service';
import { MoveSelectionService } from '@app/services/selection/move-selection.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';

@Component({
    selector: 'app-selection-config',
    templateUrl: './selection-config.component.html',
    styleUrls: ['./selection-config.component.scss'],
})
export class SelectionConfigComponent {
    SelectionBox: typeof SelectionBox = SelectionBox;
    isMagnetismEnabled: boolean;

    constructor(
        public selectionService: SelectionService,
        public clipboardService: ClipboardService,
        public magnetismService: MagnetismService,
        private moveSelectionService: MoveSelectionService,
    ) {}

    enableGridMagnetism(isChecked: boolean): void {
        this.isMagnetismEnabled = isChecked;
        this.moveSelectionService.isMagnetism = isChecked;
        this.moveSelectionService.enableMagnetism(isChecked);
    }
}

import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    mousePosition: Vec2;
    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
    }
}

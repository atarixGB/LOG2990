import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Component({
    selector: 'app-working-area',
    templateUrl: './working-area.component.html',
    styleUrls: ['./working-area.component.scss'],
})
export class WorkingAreaComponent {
    mousePosition: Vec2;
    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
    }
}

import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Component({
    selector: 'app-drawing-surface',
    templateUrl: './drawing-surface.component.html',
    styleUrls: ['./drawing-surface.component.scss'],
})
export class DrawingSurfaceComponent {
    mousePosition: Vec2;
    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
    }
}

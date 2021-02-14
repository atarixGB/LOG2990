import { Component, ElementRef, HostListener, OnChanges, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

@Component({
    selector: 'app-working-area',
    templateUrl: './working-area.component.html',
    styleUrls: ['./working-area.component.scss'],
})
export class WorkingAreaComponent implements OnChanges {
    @ViewChild('container')
    container: ElementRef;

    mousePosition: Vec2;
    size: Vec2;

    constructor() {}

    ngOnChanges(): void {
        let width = this.container.nativeElement.offsetWidth;
        let height = this.container.nativeElement.offsetHeight;
        console.log('Width in working area : ' + width);
        console.log('Height in working area :' + height);
        this.size = { x: width, y: height };
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
    }
}

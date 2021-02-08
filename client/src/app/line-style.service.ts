import { Injectable, Input } from '@angular/core';
import { DEFAULT_LINE_THICKNESS } from './constants';

@Injectable({
    providedIn: 'root',
})
export class LineStyleService {
    @Input() thickness: number;

    constructor() {
        this.thickness = DEFAULT_LINE_THICKNESS;
    }
}

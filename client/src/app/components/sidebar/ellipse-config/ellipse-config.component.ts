import { Component } from '@angular/core';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { TypeStyle } from 'src/app/interfaces-enums/type-style';
@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent {
    ellipseService: EllipseService;

    constructor(ellipseService: EllipseService) {
        this.ellipseService = ellipseService;
        selectType: TypeStyle;
        returnType: TypeStyle;
    }

    updateLineWidth(value: number): number {
        return value;
    }
}

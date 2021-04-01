import { Component } from '@angular/core';
import { TextService } from '@app/services/tools/text/text.service';

@Component({
  selector: 'app-text-config',
  templateUrl: './text-config.component.html',
  styleUrls: ['./text-config.component.scss']
})
export class TextConfigComponent{

  constructor(public textService: TextService) {}

  formatLabel(value: number): string {
    return value + 'px';
}

}

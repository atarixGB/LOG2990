import { Component } from '@angular/core';
import { Emphasis, Font } from '@app/constants';
import { TextService } from '@app/services/tools/text/text.service';

@Component({
  selector: 'app-text-config',
  templateUrl: './text-config.component.html',
  styleUrls: ['./text-config.component.scss']
})
export class TextConfigComponent{
  Font: typeof Font = Font;
  Emphasis: typeof Emphasis = Emphasis;
  constructor(public textService: TextService) { }

  formatLabel(value: number): string {
    return value + 'px';
}

}

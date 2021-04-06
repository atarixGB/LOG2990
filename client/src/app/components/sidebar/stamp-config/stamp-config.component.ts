import { Component } from '@angular/core';
import { StampService } from '@app/services/tools/stamp/stamp.service';
@Component({
  selector: 'app-stamp-config',
  templateUrl: './stamp-config.component.html',
  styleUrls: ['./stamp-config.component.scss']
})
export class StampComponent {

  constructor(public stampService: StampService) {}

  ngOnInit(): void {
  }

}

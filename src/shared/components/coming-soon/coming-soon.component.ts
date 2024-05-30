import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
})
export class ComingSoonComponent {
  @Input() icon: string;
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  @Input() height: string = '100%';
  @Input() show: boolean = true;
}

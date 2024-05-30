import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-project-manager-fields',
  templateUrl: './project-manager-fields.component.html',
  styleUrls: ['./project-manager-fields.component.scss'],
})
export class ProjectManagerFieldsComponent {
  @Input() projectManager;
}

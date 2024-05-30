import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ven-checklist-call',
  templateUrl: './checklist-call.component.html',
  styleUrls: ['./checklist-call.component.scss']
})
export class ChecklistCallComponent implements OnInit {
  @Input() checklist;
  @Input() specId;
  @Input() item;
  @Input() emails: string[];
  @Input() name: string;
  @Input() phones: string;
  public phone;

  ngOnInit(): void {
    this.phone = this.phones && this.phones.length > 0 ? this.phones[0] : null;
  }
}

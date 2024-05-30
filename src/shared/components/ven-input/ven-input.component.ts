import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ven-input',
  templateUrl: './ven-input.component.html',
  styleUrls: ['./ven-input.component.scss'],
})
export class VenInputComponent implements OnInit {
  @Input() label;
  @Input() value;
  @Input() styleClass;
  @Output() valueChanged = new EventEmitter();

  public inputForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.inputForm = this.fb.group({ field: [''] });
  }

  ngOnInit(): void {}

  onBlur() {
    this.valueChanged.emit(this.inputForm.value.field);
  }
}

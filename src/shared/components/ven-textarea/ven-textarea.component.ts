import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ven-textarea',
  templateUrl: './ven-textarea.component.html',
  styleUrls: ['./ven-textarea.component.scss'],
})
export class VenTextareaComponent implements OnInit, OnChanges {
  @Input() label;
  @Input() value;
  @Input() styleClass;
  @Output() valueChanged = new EventEmitter();

  public inputForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inputForm = this.fb.group({ field: [this.value || ''] });
  }

  ngOnChanges(changes) {
    this.inputForm?.patchValue({ field: this.value });
  }

  onBlur() {
    this.valueChanged.emit(this.inputForm.value.field);
  }
}

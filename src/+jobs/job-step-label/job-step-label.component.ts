import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ven-job-step-label',
  templateUrl: './job-step-label.component.html',
  styleUrls: ['./job-step-label.component.scss'],
})
export class JobStepContentLabel implements OnInit {
  @Input() step;
  constructor() {}

  ngOnInit(): void {}
}

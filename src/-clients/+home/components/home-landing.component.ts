import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ven-staff-landing',
  template: `<div class="container"><p>Logged into Venture Clients account!</p></div>`,
  styles: [
    `
      .container {
        padding: 128px;
        font-size: 2rem;
      }
    `,
  ],
})
export class HomeLandingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

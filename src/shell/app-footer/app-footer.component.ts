import { APP_CONFIG } from 'app.config';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'ven-application-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent {
  public environment;
  // todo how do we access env ? service?
  constructor(@Inject(APP_CONFIG) config) {
    this.environment = config;
  }
}

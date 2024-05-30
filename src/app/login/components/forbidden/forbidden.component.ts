import { AuthService } from '@auth/services/auth.service';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent {
  public homePage = this.authService.homePage;

  constructor(private authService: AuthService) {
    this.homePage = authService.homePage;
  }
}

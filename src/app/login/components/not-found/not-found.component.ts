import { AuthService } from '@auth/services/auth.service';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class PageNotFoundComponent {
  public homePage = this.authService.homePage;
  public currentLoggedInUserName: string;

  constructor(private authService: AuthService) {
    this.homePage = authService.homePage;
    this.currentLoggedInUserName = this.authService.authUser.name;
  }
}

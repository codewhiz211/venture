import { Component, OnInit } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-welcome-message',
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.scss'],
})
export class WelcomeMessageComponent implements OnInit {
  public currentTime: string;
  public currentLoggedInUserName: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentLoggedInUserName = this.authService.authUser.name;
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      this.currentTime = 'morning';
    } else if (currentHour < 17) {
      this.currentTime = 'afternoon';
    } else {
      this.currentTime = 'evening';
    }
  }
}

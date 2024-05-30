import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ven-auth-action',
  templateUrl: './auth-action.component.html',
  styleUrls: ['./auth-action.component.scss']
})
export class AuthActionComponent implements OnInit {
  public authData;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.authData = {
      mode: this.route.snapshot.queryParamMap.get('mode'),
      oobCode: this.route.snapshot.queryParamMap.get('oobCode'),
      apiKey: this.route.snapshot.queryParamMap.get('apiKey'),
      lang: this.route.snapshot.queryParamMap.get('lang')
    };
  }
}

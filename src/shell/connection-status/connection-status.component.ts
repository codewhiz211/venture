import 'firebase/database';

import * as firebase from 'firebase/app';

import { Component, OnInit } from '@angular/core';

import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-connection-status',
  template: `
    <div *ngIf="!connected">
      <p>Oh snap!</p>
      <p>
        It looks like you no longer have a connection to the internet. Please check your connection and then refresh the page.If that
        doesn’t work, please try again later.
      </p>
    </div>
  `,
  // TODO wrap on small displays
  styles: [
    `
      div {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;

        font-size: 26px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        z-index: 1000;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
        line-height: 32px;
      }
      p {
        width: 70%;
      }
    `,
  ],
})
export class ConnectionStatusComponent implements OnInit {
  public connected: boolean = true;
  private initialising: boolean = true;

  constructor(private windowService: WindowService) {}

  ngOnInit(): void {
    firebase
      .database()
      .ref('.info/connected')
      .on('value', (connectedSnap) => {
        // ignore the first connection failed as this is fired during initialising
        const state = connectedSnap.val();
        const body = document.getElementById('body');
        if (this.connected && !this.initialising && !state) {
          this.connected = false;
          if (body) {
            console.error('Firebase connection lost');
            this.windowService.removeBodyClass('do-scroll');
            this.windowService.addBodyClass('no-scroll');
          }
        } else {
          if (body) {
            this.connected = true;
            this.windowService.removeBodyClass('no-scroll');
            this.windowService.addBodyClass('do-scroll');
          }
        }
        if (this.initialising) {
          this.initialising = false;
        }
      });
  }
}

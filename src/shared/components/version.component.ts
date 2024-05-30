import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ven-version',
  template: `
    <div class="container">
      <span *ngIf="!isProd">{{ env }} •</span>
      <span>{{ version }} •</span>
      <span *ngIf="!isProd"><a href="{{ build }}">Build</a> •</span>
      <span *ngIf="!isProd"><a href="https://bitbucket.org/mattg88/venture-developments/commits/{{ commit }}"> Commit</a> •</span>
      <span><img src="https://app.codeship.com/projects/f7157c00-83ca-0136-bf62-06294081aa1e/status?branch={{ branch }}" /></span>
    </div>
  `,
  styles: [
    `
      .container {
        align-items: center;
        display: flex;
        padding: 4px;
      }

      .container span {
        margin-right: 8px;
      }
    `,
  ],
})
export class VersionComponent implements OnInit {
  @Input() environment: { build: string; env: string; version: string; commit: string };

  public branch: string;
  public build: string;
  public commit: string;
  public env: string;
  public isProd: boolean;
  public version: string;

  ngOnInit() {
    console.log(this.environment);
    this.build = this.environment.build;
    this.env = this.environment.env;
    this.commit = this.environment.commit;
    this.branch = this.environment.env === 'PROD' ? 'master' : 'master'; // TODO support test
    this.version = this.environment.version === 'APP_VERSION' ? 'LOCAL' : this.environment.version;
    this.isProd = this.environment.env === 'PROD';
  }
}

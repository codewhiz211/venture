import { Component } from '@angular/core';
/*
$blue-primary: #008be5;
$blue-light: #62bbff;
$blue-dark: #005eb2;
*/

@Component({
  selector: 'ven-subbie-icons',
  template: `<div class="container">
    <div>
      <mat-form-field class="half-width" appearance="outline">
        <mat-label>Size</mat-label>
        <input matInput type="number" step="0.05" [(ngModel)]="form.size" id="size" name="size" #size="ngModel" required />
      </mat-form-field>
      <div class="item-container item-header">
        <div>Icon</div>
        <div>Outlined</div>
        <div>Filled</div>
      </div>
      <div *ngFor="let icon of icons" class="item-container">
        <div>{{ icon }}</div>
        <ven-icon-new title="{{ icon }}" [icon]="icon" [colour]="'#008be5'" [margin]="16" [size]="form.size"></ven-icon-new>
        <ven-icon-new title="{{ icon }}" [icon]="icon" [colour]="'#008be5'" [margin]="16" [size]="form.size" [filled]="true"></ven-icon-new>
      </div>
    </div>
  </div>`,
  styles: [
    `
      .container {
        background: white;
        border-radius: 16px;
        margin-right: 16px;
        padding: 24px;
        font-size: 2rem;
      }
      .container > div {
        max-width: 1000px;
      }
      .item-container {
        display: flex;
        border: 1px solid #eee;
        padding: 4px;
      }
      .item-container > div {
        font-size: 18px;
      }
      .item-container > * {
        flex: 1;
      }
      .item-header {
        font-weight: bold;
      }
      .mat-form-field {
        font-size: 18px;
      }
    `,
  ],
})
export class IconsPageComponent {
  public icons = [
    'account_circle',
    'add',
    'add_circle',
    'add_a_photo',
    'add_photo_alternate',
    'arrow_back',
    'assessment',
    'attach_file',
    'attach_money',
    'build',
    'call',
    'check',
    'check_circle',
    'chevron_right',
    'circle',
    'close',
    'contact_phone',
    'content_copy',
    'create_new_folder',
    'delete',
    'delete_forever',
    'description',
    'edit',
    'email',
    'error',
    'error_outline',
    'event_note',
    'expand_more',
    'filter_list',
    'file_upload',
    'folder',
    'handyman',
    'history',
    'home',
    'hourglass_empty',
    'insert_photo',
    'keyboard_backspace',
    'link',
    'lock',
    'more_vert',
    'notification_important',
    'notifications',
    'people',
    'person',
    'place',
    'print',
    'reorder',
    'request_quote',
    'search',
    'sell',
    'share',
    'star',
    'task_alt',
    'timeline',
    'touch_app',
    'tune',
    'track_changes',
  ];

  public form;

  ngOnInit() {
    this.form = {
      size: 1,
    };
  }
}

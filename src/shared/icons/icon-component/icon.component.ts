import { Component, ElementRef, HostBinding, HostListener, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ven-icon-new',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnChanges {
  @Input() badge: number = 0;
  @Input() colour: string = 'white';
  @Input() hover: string; //#039be5
  @Input() hide: boolean = false;
  @Input() filled: boolean = false;
  @Input() margin: number = 0;
  @Input() size: number = 1; // value for transform (scale)
  @Input() icon: // these are the names used in https://fonts.google.com/icons
  | 'account_circle'
    | 'add'
    | 'add_circle'
    | 'add_a_photo'
    | 'add_photo_alternate'
    | 'arrow_back'
    | 'assessment'
    | 'attach_file'
    | 'attach_money'
    | 'build'
    | 'call'
    | 'check'
    | 'check_circle'
    | 'chevron_right'
    | 'circle'
    | 'close'
    | 'contact_phone'
    | 'content_copy'
    | 'create_new_folder'
    | 'delete'
    | 'delete_forever'
    | 'description'
    | 'edit'
    | 'email'
    | 'error'
    | 'error_outline'
    | 'event_note'
    | 'expand_more'
    | 'filter_list'
    | 'file_upload'
    | 'folder'
    | 'handyman'
    | 'history'
    | 'home'
    | 'hourglass_empty'
    | 'insert_photo'
    | 'keyboard_backspace'
    | 'library_books'
    | 'link'
    | 'lock'
    | 'more_vert'
    | 'notification_important'
    | 'notifications'
    | 'people'
    | 'person'
    | 'place'
    | 'print'
    | 'reorder'
    | 'request_quote'
    | 'search'
    | 'sell'
    | 'share'
    | 'sync'
    | 'star'
    | 'task_alt'
    | 'timeline'
    | 'touch_app'
    | 'tune'
    | 'track_changes';

  @HostBinding('class.hide') hideClass: boolean = false;

  @HostBinding('style.margin-right.px')
  get width(): number {
    return this.margin;
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.hover) {
      this.fill = this.hover;
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.fill = this.colour;
  }

  public fill: string;

  public transformStyle: string;

  constructor(public elementRef: ElementRef) {}

  ngOnChanges() {
    this.fill = this.colour;
    this.hideClass = this.hide;
    this.transformStyle = this.size !== 1 ? `scale(${this.size})` : 'unset';
  }
}

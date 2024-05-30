import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'ven-application-chrome-details-content',
  templateUrl: './app-chrome-details-content.component.html',
  styleUrls: ['./app-chrome-details-content.component.scss'],
})
export class AppChromeDetailContentComponent implements AfterViewInit {
  @Input() contentConfig;
  @Input() currentTab;
  @Output() tabChanged = new EventEmitter();
  @Output() tabChangeFinished = new EventEmitter();
  @ViewChildren('tabContent', { read: ViewContainerRef }) tabContent: QueryList<ViewContainerRef>;
  constructor(private cfr: ComponentFactoryResolver, private cd: ChangeDetectorRef) {}

  private tabIds = {};
  public selectedIndex = 0;

  ngAfterViewInit() {
    //We need to load components in AfterViewInit hook, otherwise we will not get tabContent.
    this.loadComponents();
  }

  ngOnChanges(changes) {
    if (changes.currentTab) {
      this.selectedIndex = this.tabIds[changes.currentTab.currentValue];
    }
  }

  loadComponents() {
    if (this.contentConfig) {
      this.tabContent.forEach((containerRef, i) => {
        const componentFactory = this.cfr.resolveComponentFactory(this.contentConfig[i].component);
        const componentRef = containerRef.createComponent(componentFactory);
        if (this.contentConfig[i].data) {
          const dataKey = this.contentConfig[i].dataKey;
          if (dataKey) {
            componentRef.instance[dataKey] = this.contentConfig[i].data;
          } else {
            //@ts-ignore
            componentRef.instance.data = this.contentConfig[i].data;
          }
        }
        if (this.currentTab) {
          //need to change tab from the event of content
          this.tabIds[this.contentConfig[i].id] = i;
        }
      });

      // to solve error:ExpressionChangedAfterItHasBeenCheckedError
      this.cd.detectChanges();
    }
  }

  handleTabChange(data) {
    this.tabChanged.emit(this.contentConfig[data.index].id);
  }

  finishedTabChange(data) {
    this.tabChangeFinished.emit();
  }
}

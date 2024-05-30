import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { Column } from './columns.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WindowService } from '@services/window.service';

//This is a workaround to fix the angular material table bug that it can't retain in router animation
//https://github.com/angular/components/issues/8057
export const rowAnimation = trigger('rowAnimation', [transition('* => void', [animate('0ms', style({ display: 'none' }))])]);

@Component({
  selector: 'ven-table',
  templateUrl: './ven-table.component.html',
  styleUrls: ['./ven-table.component.scss'],
  animations: [rowAnimation],
})
export class VenTableComponent implements OnInit {
  @Input() data;
  @Input() columns: Column[];
  @Input() initialSortedColumn;
  @Input() disableHover;
  @Input() hidePagnator;
  @Input() filter: string;
  @Output() onRowClick = new EventEmitter();
  @Output() onOperatorClick = new EventEmitter();

  public dataSource;

  private paginator: MatPaginator;
  private sort: MatSort;

  public displayedColumns;
  public isMobile;
  constructor(private windowService: WindowService) {
    this.isMobile = this.windowService.isMobile;
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  ngOnInit(): void {
    this.columns = this.isMobile
      ? this.columns
          .filter((column) => !(column?.mobileWidth == '0%'))
          .map((column) => {
            return { ...column, width: column.mobileWidth };
          })
      : this.columns;
    this.displayedColumns = this.columns.map((column) => column.accessor);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource = new MatTableDataSource(changes['data'].currentValue);
      this.setDataSourceAttributes();
    }
    if (changes['filter']) {
      this.applyFilter(changes['filter'].currentValue);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setDataSourceAttributes() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onAction(row, action) {
    this.onOperatorClick.emit(action ? { row, action } : row);
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-searchable-table',
  templateUrl: './searchable-table.component.html',
  styleUrls: ['./searchable-table.component.scss'],
})
export class SearchableTableComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() columns;
  @Input() placeholder;
  @Input() filterPredicate;
  @Output() handleRowClick = new EventEmitter();

  private paginator: MatPaginator;
  private sort: MatSort;
  public dataSource;

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
    this.displayedColumns = this.columns.map((column) => column.accessor);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource = new MatTableDataSource(changes['data'].currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.filterPredicate) {
        this.dataSource.filterPredicate = this.filterPredicate;
      }
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

  onAction(row) {
    this.handleRowClick.emit(row);
  }
}

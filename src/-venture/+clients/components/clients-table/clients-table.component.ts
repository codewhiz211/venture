import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { ClientSummary } from '@interfaces/client-summary.interface';
import { ClientsTableDataSource } from '../../clients.datasource';
import { FilterDefinition } from '../../filter-definition.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'ven-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss'],
})
export class ClientsTableComponent implements OnInit, OnChanges {
  @Input() clients: ClientSummary[];
  @Input() searchTerms: any;
  @Output() clientClicked = new EventEmitter();

  displayedColumns: string[] = ['lot', 'client', 'lastModified', 'status'];
  dataSource: ClientsTableDataSource;
  showLoader = true;

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  ngOnInit() {
    this.showLoader = true;
    this.dataSource = new ClientsTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clients']) {
      this.dataSource = new ClientsTableDataSource(changes['clients'].currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.showLoader = !this.clients;
    }
  }

  sortData() {}

  setDataSourceAttributes() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onFilterChanged(filterDefinition: FilterDefinition) {
    this.dataSource.filter = filterDefinition;
  }

  applyFilter(searchTerm: string) {
    this.dataSource.filter = { searchTerm, filterOptions: [] };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClientClick(row) {
    this.clientClicked.emit(row);
  }
}

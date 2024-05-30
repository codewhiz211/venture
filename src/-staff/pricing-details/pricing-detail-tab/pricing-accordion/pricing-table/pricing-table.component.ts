import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { EditAdminMarginComponent } from './edit-admin-margin/edit-admin-margin.component';
import { PngDetailsComponent } from './png-details/png-details.component';
import { PricingService } from '@services/spec/pricing.service';
import { clone } from 'ramda';
import { skipWhile } from 'rxjs/operators';

@Component({
  selector: 'ven-pricing-table',
  templateUrl: './pricing-table.component.html',
  styleUrls: ['./pricing-table.component.scss'],
})
export class PricingTableComponent extends BaseComponent implements OnInit {
  @Input() pricingSection; // data
  @Input() table;
  @Input() field;
  @Input() uid;
  @Input() editable;

  public totals; //totalRows, we only keep the admin margin fee in DB, other values are generated at frontend
  public items;
  public adminMargin;
  constructor(private dialogService: DialogService, private pricingService: PricingService) {
    super();
  }

  ngOnInit(): void {
    this.items = this.initialItems();
    this.adminMargin = this.pricingSection?.adminFee >= 0 ? this.pricingSection?.adminFee : 0.05;
    this.totals = this.getTotalRows();
  }

  private initialItems() {
    const items = {};
    this.table.tableSections?.forEach((section) => {
      items[section] = this.pricingSection?.items[section] || [];
    });
    return this.table.tableSections ? items : this.pricingSection?.items || [];
  }

  addRow() {
    this.dialogService
      .open(PngDetailsComponent, {
        data: { rowFields: this.table.dialogFields },
        dialogTitle: 'Add a row',
      })
      .pipe(
        this.takeUntilDestroy(),
        skipWhile((r) => !r)
      )
      .subscribe((row) => {
        this.addItem(row);
        this.updateRows('Add');
      });
  }

  handleTableClicked({ row, action }) {
    if (action == 'Edit') {
      this.dialogService
        .open(PngDetailsComponent, {
          data: { rowFields: this.table.dialogFields, row },
          dialogTitle: 'Edit row',
        })
        .pipe(
          this.takeUntilDestroy(),
          skipWhile((r) => !r)
        )
        .subscribe((row) => {
          this.updateItem(row);
          this.updateRows(action);
        });
    } else if (action == 'Delete') {
      this.deleteItem(row);
      this.updateRows(action);
    }
  }

  editAdminMargin() {
    this.dialogService
      .open(EditAdminMarginComponent, {
        data: { margin: this.adminMargin },
        dialogTitle: 'Edit admin',
      })
      .pipe(
        this.takeUntilDestroy(),
        skipWhile((r) => !(r >= 0))
      )
      .subscribe((result) => {
        this.adminMargin = result;
        this.updateTotal();
        this.pricingService.updatePricing(this.uid, { items: this.items, adminFee: this.adminMargin }, 'UpdateAdminFee', this.field);
      });
  }

  private addItem(row) {
    if (this.table.tableSections) {
      this.items[row.section].push({ ...row, total: this.calcLineTotal(row), id: this.items[row.section].length });
    } else {
      this.items.push({ ...row, total: this.calcLineTotal(row), id: this.items.length });
    }
  }

  private updateItem(row) {
    if (this.table.tableSections) {
      this.items[row.section].splice(row.id, 1, { ...row, total: this.calcLineTotal(row) });
    } else {
      this.items.splice(row.id, 1, { ...row, total: this.calcLineTotal(row) });
    }
  }

  private deleteItem(row) {
    if (this.table.tableSections) {
      this.items[row.section].splice(row.id, 1);
    } else {
      this.items.splice(row.id, 1); //id is as the same as position
    }
  }

  private updateRows(action) {
    this.items = clone(this.items); // to trigger angular change detection
    this.totals = this.getTotalRows();
    this.pricingService.updatePricing(this.uid, { items: this.items, adminFee: this.adminMargin }, action, this.field);
  }

  private calcLineTotal(row) {
    return row.qty * row.value * (1 + row.margin / 100);
  }

  private getAllRows() {
    if (this.table.tableSections) {
      const rows = [];
      Object.values(this.items).forEach((subRows: any[]) => {
        rows.splice(rows.length, 0, ...subRows);
      });
      return rows || [];
    } else {
      return this.items || [];
    }
  }

  private getTotalRows() {
    const rows = this.getAllRows();
    const subTotal = rows.reduce((total, row) => total + row.total, 0);
    return [
      {
        description: 'subtotal',
        margin: '',
        total: subTotal,
      },
      {
        description: 'admin',
        margin: this.adminMargin,
        total: this.calcAdminTotal(subTotal),
        operator: {
          icon: 'more_vert',
          action: () => this.editAdminMargin(),
        },
      },
      {
        description: 'total',
        margin: '',
        total: this.calcAllTotal(subTotal),
      },
    ];
  }

  private updateTotal() {
    const subTotal = this.totals.find((row) => row.description == 'subtotal').total;
    const adminRow = this.totals.find((row) => row.description == 'admin');
    const totalRow = this.totals.find((row) => row.description == 'total');
    adminRow.total = this.calcAdminTotal(subTotal);
    adminRow.margin = this.adminMargin;
    totalRow.total = this.calcAllTotal(subTotal);
  }

  private calcAdminTotal(subTotal) {
    return subTotal * this.adminMargin;
  }

  private calcAllTotal(subTotal) {
    return subTotal * (1 + this.adminMargin);
  }
}

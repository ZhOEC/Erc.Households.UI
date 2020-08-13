import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AccountingPointDetailService } from '../accounting-point-detail.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table/ng-zorro-antd-table';

@Component({
  selector: 'app-accounting-point-invoices',
  templateUrl: './accounting-point-invoices.component.html',
  styleUrls: ['./accounting-point-invoices.component.scss']
})
export class AccountingPointInvoicesComponent implements OnChanges {
  @Input() accountingPointId: number
  invoices = [];
  loading = true;
  total = 0;
  pageIndex = 1;
  pageSize = 6

  constructor(private accountingPointDetailService: AccountingPointDetailService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.accountingPointId = changes['accountingPointId'].currentValue;
    if (!changes['accountingPointId'].isFirstChange())
    {
      this.LoadInvoices();
    }
  }

  LoadInvoices() {
    this.accountingPointDetailService.getInvoices(this.accountingPointId, this.pageIndex, this.pageSize)
    .subscribe(data => {
      this.invoices = data.items;
      this.loading = false;
      this.total = data.totalCount;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    this.LoadInvoices();
  }
}

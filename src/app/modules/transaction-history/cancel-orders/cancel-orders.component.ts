import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { OrderElement } from '../order-element';
@Component({
  selector: 'app-cancel-orders',
  templateUrl: './cancel-orders.component.html',
  styleUrls: ['./cancel-orders.component.css']
})
export class CancelOrdersComponent implements OnInit {

  pageSize = 10;
  pageIndex = 0;
  length = 1000;

  constructor(private apiServ: ApiService, private changeDetectorRefs: ChangeDetectorRef) {}
  displayedColumns: string[] = ['orderHash', 'owner', 'pair', 'price', 'amount', 'timestamp'];
  dataSource: any = new MatTableDataSource<OrderElement>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.apiServ.getExchangilyCancelledOrders(this.pageSize, this.pageIndex).subscribe(
      (orders: any) => {
        this.dataSource.data = orders;
      }
    );

    this.apiServ.getExchangilyCancelledOrdersTotalCount().subscribe(
      (totalCount: any) => {
        this.length = totalCount;
      }
    );

    this.dataSource.paginator = this.paginator;
  }

  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.apiServ.getExchangilyCancelledOrders(this.pageSize, this.pageIndex).subscribe(
      (orders: any) => {
        this.dataSource.data = orders;
        this.changeDetectorRefs.detectChanges();
      }
    );
  }

}

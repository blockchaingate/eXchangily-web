import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { TradeElement } from '../trade-element';
@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {

  pageSize = 10;
  pageIndex = 0;
  length = 1000;

  constructor(private apiServ: ApiService, private changeDetectorRefs: ChangeDetectorRef) {}
  displayedColumns: string[] = [
    'orderHashOne', 
    'orderHashTwo', 
    'pair', 
    'filledStatus', 
    'timestamp'
  ];
  dataSource: any = new MatTableDataSource<TradeElement>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.apiServ.getExchangilyExchangeTrades(this.pageSize, this.pageIndex).subscribe(
      (orders: any) => {
        this.dataSource.data = orders;
      }
    );

    this.apiServ.getExchangilyExchangeTradesTotalCount().subscribe(
      (totalCount: any) => {
        this.length = totalCount;
      }
    );

    this.dataSource.paginator = this.paginator;
  }

  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.apiServ.getExchangilyExchangeTrades(this.pageSize, this.pageIndex).subscribe(
      (orders: any) => {
        this.dataSource.data = orders;
        this.changeDetectorRefs.detectChanges();
      }
    );
  }
}
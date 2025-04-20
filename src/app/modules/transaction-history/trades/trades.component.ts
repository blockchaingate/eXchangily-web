import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
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
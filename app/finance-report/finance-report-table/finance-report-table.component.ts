import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { Observable } from "rxjs";
import { FinanceReportTableItem } from "src/app/clubs.service";
import {
  FinanceReportTableDataSource,
} from "./finance-report-table-datasource";

@Component({
  selector: "app-finance-report-table",
  templateUrl: "./finance-report-table.component.html",
  styleUrls: ["./finance-report-table.component.less"],
})
export class FinanceReportTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<FinanceReportTableItem>;
  dataSource: FinanceReportTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["date", "amount", "cumulative"];

  @Input()
  data: Observable<FinanceReportTableItem[]>;

  ngOnInit() {
    this.dataSource = new FinanceReportTableDataSource(this.data);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}

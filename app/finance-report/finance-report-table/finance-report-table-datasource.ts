import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, startWith } from "rxjs/operators";
import { Observable, of as observableOf, merge, combineLatest } from "rxjs";
import { FinanceReportTableItem } from "src/app/clubs.service";

// TODO: Replace this with your own data model type
/**
 * Data source for the FinanceReportTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class FinanceReportTableDataSource extends DataSource<FinanceReportTableItem> {
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private data: Observable<FinanceReportTableItem[]>) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<FinanceReportTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.

    return combineLatest([
      this.data,
      this.paginator.page.pipe(startWith(0)),
      this.sort.sortChange.pipe(startWith({active:'date', direction:'asc'})),
    ]).pipe(
      map(([data, page, sort]) => {
        return this.getPagedData(this.getSortedData([...data]));
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: FinanceReportTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: FinanceReportTableItem[]) {
    if (!this.sort.active || this.sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (this.sort.active) {
        case "date":
          return compare(a.date, b.date, isAsc);
        case "amount":
          return compare(+a.amount, +b.amount, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

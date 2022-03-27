import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, startWith } from "rxjs/operators";
import { Observable, of as observableOf, merge, combineLatest } from "rxjs";
import { exclusionResponse } from "../exceptions.service";

/**
 * Data source for the BillExclusions view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class BillExclusionsDataSource extends DataSource<exclusionResponse> {
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private data: Observable<exclusionResponse[]>) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<exclusionResponse[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.

    return combineLatest([
      this.data,
      this.paginator.page.pipe(startWith(1)),
      this.sort.sortChange.pipe(
        startWith({ active: "name", direction: "asc" })
      ),
    ]).pipe(
      map(([data, paginator,sort]) => {
        console.log('paginator', paginator);
        console.log('sort', sort);
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
  private getPagedData(data: exclusionResponse[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: exclusionResponse[]) {
    if (!this.sort.active || this.sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (this.sort.active) {
        case "name":
          return compare(a.name, b.name, isAsc);
        case "notes":
          return compare(a.notes, b.notes, isAsc);
        case "email":
          return compare(a.bill_member.email?.toLowerCase(), b.bill_member.email?.toLowerCase(), isAsc);
        case "rec_no":
          return compare(+a.rec_no, +b.rec_no, isAsc);
        case "outstanding":
          return compare(+a.bill.outstanding, +b.bill.outstanding, isAsc);
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

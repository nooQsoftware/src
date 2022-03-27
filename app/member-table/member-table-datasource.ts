import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, startWith } from "rxjs/operators";
import { Observable, of as observableOf, merge, combineLatest } from "rxjs";
import { MemberService, MemberShort } from "../member.service";

// TODO: Replace this with your own data model type
export interface MemberTableItem {
  name: string;
  id: number;
}

/**
 * Data source for the MemberTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MemberTableDataSource extends DataSource<MemberShort> {
  data: Observable<MemberShort[]>;
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private svc: MemberService) {
    super();
    this.data = svc.getMembers();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<MemberShort[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return combineLatest([
      this.data,
      this.paginator.page.pipe(startWith(0)),
      this.sort.sortChange.pipe(startWith({ active: "id", direction: "asc" })),
    ]).pipe(
      map(([v, page, sort]) => {
        return this.getPagedData(this.getSortedData(v));
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
  private getPagedData(data: MemberShort[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: MemberShort[]) {
    if (!this.sort.active || this.sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (this.sort.active) {
        case "name":
          return compare(a.last_name, b.last_name, isAsc);
        case "id":
          return compare(+a.id, +b.id, isAsc);
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

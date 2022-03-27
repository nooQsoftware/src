import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {
  filter,
  map,
  repeatWhen,
  shareReplay,
  startWith,
  tap,
} from "rxjs/operators";
import {
  Observable,
  of as observableOf,
  merge,
  combineLatest,
  Subject,
  BehaviorSubject,
} from "rxjs";
import { ArrangementTableItem } from "../arrangement.service";

// TODO: replace this with real data from your application

/**
 * Data source for the ArrangementTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ArrangementTableDataSource extends DataSource<ArrangementTableItem> {
  paginator: MatPaginator;
  sort: MatSort;

  private data: Observable<ArrangementTableItem[]>;
  private _pageCount: BehaviorSubject<number> = new BehaviorSubject(null);
  get pageCount() {
    return this._pageCount.pipe(filter((v) => v != null));
  }
  constructor(data: Observable<ArrangementTableItem[]>) {
    super();
    this.data = data;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ArrangementTableItem[]> {
    const dataMutations = [
      this.data.pipe(filter((v) => v != null)),
      this.paginator != null
        ? this.paginator.page.pipe(
            startWith({
              pageIndex: this.paginator.pageIndex,
              pageSize: 25,
              length: 100,
            })
          )
        : new BehaviorSubject(null),
      this.sort.sortChange.pipe(startWith(this.defaultSort())),
    ];

    return combineLatest(dataMutations).pipe(
      map(([data, pager, sorter]) => {
        if (pager == null) {
          return this.getSortedData([...data]);
        } else {
          this._pageCount.next(Math.ceil(data.length));
          this.paginator.length = data.length;
          return this.getPagedData(this.getSortedData([...data]));
        }
      })
    );
  }
  defaultSort(): any {
    return null;
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
    console.log("disconnected");
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ArrangementTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ArrangementTableItem[]) {
    if (!this.sort.active || this.sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (this.sort.active) {
        case "name":
          return compare(a.name, b.name, isAsc);
        case "email":
          return compare(a.email, b.email, isAsc);
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

import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { combineLatest, merge, scheduled, Subject } from "rxjs";
import {
  filter,
  map,
  mergeAll,
  mergeMap,
  repeatWhen,
  startWith,
  tap,
} from "rxjs/operators";
import {
  ExceptionsService,
  exclusionRequest,
  exclusionResponse,
} from "../exceptions.service";
import { NewExclusionComponent } from "../new-exclusion/new-exclusion.component";
import { BillExclusionsDataSource } from "./bill-exclusions-datasource";

@Component({
  selector: "app-bill-exclusions",
  templateUrl: "./bill-exclusions.component.html",
  styleUrls: ["./bill-exclusions.component.less"],
})
export class BillExclusionsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<exclusionResponse>;
  dataSource: BillExclusionsDataSource;
  refresh = new Subject<boolean>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    "rec_no",
    "name",
    "notes",
    "email",
    "outstanding",
    "tools",
  ];

  constructor(
    private svc: ExceptionsService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource = new BillExclusionsDataSource(
      this.refresh.pipe(
        startWith(true),
        mergeMap((v) => this.svc.list())
      )
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  delete(row: exclusionResponse) {
    this.snack
      .open(
        `Are you sure that you wish to delete the exclusion for ${row.bill_member.name}`,
        "confirm",
        { duration: 10000 }
      )
      .onAction()
      .pipe(
        tap(() => console.log("delete", row)),
        mergeMap(() => this.svc.delete(row)),
        tap(() => this.refresh.next(true))
      )
      .subscribe();
  }

  add() {
    return this.dialog
      .open<NewExclusionComponent, null, exclusionRequest>(
        NewExclusionComponent
      )
      .afterClosed()
      .pipe(
        filter((v) => v != null),
        mergeMap((v) => this.svc.add(v)),
        tap(() => this.refresh.next(true))
      )
      .subscribe();
  }
}

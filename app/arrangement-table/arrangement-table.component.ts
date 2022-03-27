import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { of, Subject } from "rxjs";
import {
  finalize,
  mergeMap,
  repeatWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { ArrangementDialogComponent } from "../arrangement-dialog/arrangement-dialog.component";
import {
  ArrangementService,
  ArrangementTableItem,
} from "../arrangement.service";
import { ArrangementTableDataSource } from "./arrangement-table-datasource";

@Component({
  selector: "app-arrangement-table",
  templateUrl: "./arrangement-table.component.html",
  styleUrls: ["./arrangement-table.component.less"],
})
export class ArrangementTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ArrangementTableItem>;
  dataSource: ArrangementTableDataSource;
  constructor(
    private svc: ArrangementService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["name", "email", "arrangement", "tools"];

  ngOnInit() {
    this.dataSource = new ArrangementTableDataSource(
      this.svc.list().pipe(
        tap((v) => {
          return console.log(v);
        })
      )
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  delete(item: ArrangementTableItem) {
    console.log("delete", item);
    this.snack
      .open(
        `Are you sure that you wish to delete the arrangements for ${item.name}`,
        "confirm",
        { duration: 15000 }
      )
      .onAction()
      .pipe(
        mergeMap((v) => this.svc.delete(item.id)),
        tap(() => {
          this.dataSource = new ArrangementTableDataSource(this.svc.list());
          this.ngAfterViewInit();
        })
      )
      .subscribe();
  }

  edit(item: ArrangementTableItem) {
    console.log("edit", item);
    this.dialog
      .open<
        ArrangementDialogComponent,
        ArrangementTableItem,
        ArrangementTableItem
      >(ArrangementDialogComponent, {
        data: item,
        closeOnNavigation: true,
        autoFocus: true,
      })
      .beforeClosed()
      .pipe(
        tap((v) => console.log("result", v)),
        mergeMap(({ id, arrangement }) =>
          arrangement ? this.svc.update(id, arrangement) : of(null)
        ),
        tap((v) => console.log("result", v)),
        tap(() => {
          this.dataSource = new ArrangementTableDataSource(this.svc.list());
          this.ngAfterViewInit();
        })
      )
      .subscribe();
  }

  sendBill(item: ArrangementTableItem) {
    this.snack
      .open(
        `Are you sure that you wish to issue a new billing email for ${item.name}`,
        "confirm",
        { duration: 15000 }
      )
      .onAction()
      .pipe(
        mergeMap((v) => this.svc.sendBill(item.id)),
        tap(() => {
          this.dataSource = new ArrangementTableDataSource(this.svc.list());
          this.ngAfterViewInit();
        })
      )
      .subscribe();
  }
}

import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { mergeMap, tap } from "rxjs/operators";
import { MemberService, MemberShort } from "../member.service";
import {
  MemberTableDataSource,
  MemberTableItem,
} from "./member-table-datasource";

@Component({
  selector: "app-member-table",
  templateUrl: "./member-table.component.html",
  styleUrls: ["./member-table.component.less"],
})
export class MemberTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<MemberShort>;
  dataSource: MemberTableDataSource;
  clickedRow: MemberShort;

  @Output()
  selectChanged: EventEmitter<MemberShort> = new EventEmitter();

  constructor(private svc: MemberService, private snack: MatSnackBar) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    "name",
    "dob",
    "phone",
    "email",
    "membership",
    "status",
    "tools",
  ];

  ngOnInit() {
    this.dataSource = new MemberTableDataSource(this.svc);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  setSelected(row: MemberShort) {
    this.clickedRow = row;
    this.selectChanged.next(row);
  }

  sendLink(row: MemberShort) {
    this.svc
      .sendLink(row)
      .pipe(tap((v) => this.snack.open(`Link sent.`, null, { duration: 5000 })))
      .subscribe();
  }

  stageToClubV1(row: MemberShort) {
    this.snack.open(
      `Staging data for ${row.first_name} ${row.last_name} to ClubV1.`
    );
    this.svc
      .stageToV1(row)
      .pipe(
        tap((v) =>
          this.snack.open(
            `Data for ${row.first_name} ${row.last_name} successfully staged to ClubV1.`,
            "dismiss",
            { duration: 5000 }
          )
        )
      )
      .subscribe();
  }

  addToClubV1(row: MemberShort) {
    this.snack
      .open(
        `Are you sure that you want to add data for ${row.first_name} ${row.last_name} to ClubV1?`,
        "confirm",
        {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 10000,
        }
      )
      .onAction()
      .pipe(
        mergeMap(() => {
          this.snack.open(
            `Adding data for ${row.first_name} ${row.last_name} to ClubV1.`
          );
          return this.svc
            .addToV1(row)
            .pipe(
              tap((v) =>
                this.snack.open(
                  `Data for ${row.first_name} ${row.last_name} successfully added to ClubV1.`,
                  "dismiss",
                  { duration: 5000 }
                )
              )
            );
        })
      )
      .subscribe();
  }
}

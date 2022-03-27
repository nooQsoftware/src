import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { map, mergeMap, shareReplay, tap } from "rxjs/operators";
import { adminAuthorisation, ClubsService } from "src/app/clubs.service";
import { AdminEditComponent } from "../admin-edit/admin-edit.component";
import { AdminTableDataSource } from "./admin-table-datasource";

@Component({
  selector: "app-admin-table",
  templateUrl: "./admin-table.component.html",
  styleUrls: ["./admin-table.component.less"],
})
export class AdminTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<adminAuthorisation>;
  dataSource: AdminTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["id", "email", "name", "approved", "tools"];
  private _refresh = new BehaviorSubject<boolean>(null);

  constructor(
    private svc: ClubsService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {
    this.dataSource = new AdminTableDataSource(
      this._refresh.pipe(
        mergeMap(() => svc.getAdmins()),
        shareReplay(1)
      )
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  edit(item: adminAuthorisation | null) {
    this.dialog
      .open<AdminEditComponent, adminAuthorisation, adminAuthorisation>(
        AdminEditComponent,
        { data: item }
      )
      .afterClosed()
      .pipe(
        mergeMap((r) => {
          if (r != null) {
            return this.svc.sendInvitation(r);
          }
          return of(false);
        }),
        tap(() => this._refresh.next(true))
      )
      .subscribe();
  }

  suspend(item: adminAuthorisation) {
    return this.confirmAction(
      item,
      `Are you sure that you want to suspend the admin account for ${item.name}`,
      this.svc.suspendAdmin
    );
  }

  approve(item: adminAuthorisation) {
    return this.confirmAction(
      item,
      `Are you sure that you want to approve the admin account for ${item.name}`,
      this.svc.approveAdmin
    );
  }

  delete(item: adminAuthorisation) {
    return this.confirmAction(
      item,
      `Are you sure that you want to delete the admin account for ${item.name}`,
      this.svc.deleteAdmin
    );
  }

  private confirmAction<T>(
    item: adminAuthorisation,
    msg,
    fn: (it: adminAuthorisation) => Observable<T>
  ) {
    return this.snack
      .open(msg, "confirm", { duration: 5000 })
      .onAction()
      .pipe(
        mergeMap((v) => fn.bind(this.svc)(item)),
        tap((v) => this._refresh.next(true))
      )
      .subscribe();
  }
}

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { combineLatest, of, Subject } from "rxjs";
import {
  catchError,
  filter,
  finalize,
  first,
  map,
  mergeMap,
  repeatWhen,
  shareReplay,
  startWith,
  tap,
} from "rxjs/operators";
import { ClubsService } from "../clubs.service";
import { MemberService } from "../member.service";
import { BankDetailsComponent } from "./bank-details/bank-details.component";
import { ClubAdminsComponent } from "./club-admins/club-admins.component";
import { MembershipIntegrationComponent } from "./membership-integration/membership-integration.component";

@Component({
  selector: "app-club-info",
  templateUrl: "./club-info.component.html",
  styleUrls: ["./club-info.component.less"],
})
export class ClubInfoComponent implements OnInit {
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  isSuper: any;
  grp: FormGroup;
  club: any;
  private _refresh = new Subject();
  inAddMode: boolean = false;
  constructor(
    route: ActivatedRoute,
    private club_svc: ClubsService,
    private member_svc: MemberService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    fb: FormBuilder
  ) {
    this.isSuper = route.data.pipe(
      tap((d) => console.log("data", d)),
      map((d) => d.user),
      tap((d) => console.log("user", d)),
      map((d) => d?.isSuper)
    );
    this.club = combineLatest([
      this.club_svc.activeClub,
      this._refresh.pipe(startWith(null)),
    ]).pipe(
      // first(),
      mergeMap(([club]) => this.club_svc.detail(club.club_id)),
      tap((v) => console.log("building form", v)),
      tap((club) => {
        this.grp = fb.group({
          name: [club.name, [Validators.required]],
          address: [club.address, [Validators.required]],
          town: [club.town, [Validators.required]],
          postcode: [
            club.postcode,
            [Validators.required, member_svc.postcodeValidator],
          ],
          email: [club.email, [Validators.required, Validators.email]],
          max_members: [club.max_members, [Validators.required]],
          waiting_list: [club.waiting_list, []],
          year_start_month: [club.year_start_month, [Validators.required]],
          banking: [club.banking ?? {}],
        });
      })
    );
  }

  ngOnInit(): void {}

  addMode() {
    this.inAddMode = !this.inAddMode;
    if (this.inAddMode) this.grp.reset();
    else {
      this._refresh.next(true);
    }
    // Object.values(this.grp?.controls).forEach(ctrl=>ctrl.reset())
  }

  saveClub() {
    if (this.inAddMode) {
      this.club_svc
        .add(Object.assign(this.grp.value, { year_start_day: 1 }))
        .pipe(
          first(),
          tap((v) => this.snack.open("Saving...")),
          finalize(() => {
            this.snack.dismiss();
            // this.club_svc.setActiveClub()
            return this.snack.open("Club saved", null, { duration: 5000 });
          })
        )
        .subscribe();
    } else {
      this.club_svc
        .update(Object.assign(this.grp.value, { year_start_day: 1 }))
        .pipe(
          first(),
          tap((v) => this.snack.open("Saving...")),
          finalize(() => {
            this.snack.dismiss();
            return this.snack.open("Club saved", null, { duration: 5000 });
          })
        )
        .subscribe();
    }
  }

  showBanking() {
    this.dialog
      .open(BankDetailsComponent, {
        data: Object.assign(this.grp.value.banking, {
          name: this.grp.value.name,
        }),
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        filter((v) => v != null),
        mergeMap((d) => this.club_svc.setBankDetails(d)),
        tap((v) => this._refresh.next())
      )
      .subscribe();
  }

  showAdmins() {
    this.dialog.open(ClubAdminsComponent, {
      maxHeight: "60vh",
      maxWidth: "75vw",
      minWidth: "50vw",
    });
  }

  showIntegration() {
    this.club_svc
      .getIntegration()
      .pipe(
        mergeMap((integration) => {
          return this.dialog
            .open(MembershipIntegrationComponent, {
              data: integration,
              disableClose: true,
              width: "380px",
            })
            .beforeClosed();
        }),
        mergeMap((data) =>
          data == null ? of(false) : this.club_svc.setIntegration(data)
        ),
        tap((v) => {
          if (v) {
            this.snack.open(
              "Login test successful. Integration credentials updated.",
              "DISMISS",
              { duration: 15000 }
            );
            this._refresh.next();
          }
        }),
        tap((v) => {}),
        catchError((err, caught) => {
          console.error("caught", err);
          if (err.status == 304) {
            this.snack.open(
              "Login test failed. Existing credentials retained.",
              "DISMISS",
              { duration: 15000 }
            );
          }
          return of(false);
        })
      )
      .subscribe();
  }
}

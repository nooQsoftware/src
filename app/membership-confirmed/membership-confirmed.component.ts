import { Component, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, BehaviorSubject, Observable, of } from "rxjs";
import { catchError, tap, map, mergeMap, repeatWhen } from "rxjs/operators";
import { isMember, MemberFull, MemberService } from "../member.service";

@Component({
  selector: "app-membership-confirmed",
  templateUrl: "./membership-confirmed.component.html",
  styleUrls: ["./membership-confirmed.component.less"],
})
export class MembershipConfirmedComponent implements OnInit {
  member: Observable<(MemberFull | boolean)[]>;
  payReady: boolean;
  payNow: boolean;
  refresh = new EventEmitter(false);

  constructor(
    private svc: MemberService,
    private router: Router,
    route: ActivatedRoute
  ) {
    this.member = route.queryParamMap.pipe(
      tap((d) => {
        if (d.has("secure_link")) {
          this.svc.secure_link = d.get("secure_link");
          sessionStorage.setItem("secure_link", this.svc.secure_link);
        }
      }),
      mergeMap((d) =>
        svc.fromSecureLink().pipe(
          repeatWhen((v) => this.refresh),
          catchError((err, caught) => this.toNew()),
          map((v) => [v])
        )
      )
    );
    if (this.member == null) {
      this.toNew();
    }
  }

  private toNew() {
    return this.router.navigate(["/", "new-member"]);
  }

  ngOnInit(): void {}

}

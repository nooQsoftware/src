import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { combineLatest, of, Subscription } from "rxjs";
import { delay, map, mergeMap, tap } from "rxjs/operators";
import { ClubsService, invitationResponse } from "../clubs.service";

@Component({
  selector: "app-logged-in",
  templateUrl: "./logged-in.component.html",
  styleUrls: ["./logged-in.component.less"],
})
export class LoggedInComponent implements OnInit, OnDestroy {
  sub: Subscription;
  msg: string;
  constructor(
    auth: AuthService,
    activated: ActivatedRoute,
    svc: ClubsService,
    router: Router
  ) {
    this.sub = combineLatest([
      activated.params,
      activated.data,
      activated.queryParams,
    ])
      .pipe(
        mergeMap(([params, data, query]) => {
          console.log("data", data);
          console.log("params", params);
          console.log("query", query);
          if (params?.club != null) {
            if (data?.state === "before") {
              return auth
                .buildAuthorizeUrl({
                  redirect_uri: `${window.location.protocol}//${window.location.host}/logged-in`,
                  appState: {
                    target: `${params.club}/admin-confirmation?invitation=${query?.invitation}`,
                  },
                  scope: "email openid profile",
                })
                .pipe(
                  map((url) => {
                    window.open(url, "_self");
                    return false;
                  })
                );
            } else if (data?.state === "after") {
              return svc.registerInvitation(params.club, query?.invitation);
            }
          }
          return of(false);
        }),
        mergeMap((v: boolean | invitationResponse) => {
          if (v && typeof v != "boolean") {
            if (v.success) {
              if (v.approved) {
                return router.navigate(["/", "club-info"]);
              }
              return router.navigate(["/", "admin-confirmation"]);
            } else{
              this.msg=v.msg;
            }
          }
          return of(false);
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      console.log("logged-in unsub");
      this.sub.unsubscribe();
    }
  }

  ngOnInit(): void {}
}

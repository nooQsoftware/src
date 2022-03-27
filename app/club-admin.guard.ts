import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  Resolve,
} from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { Observable, of } from "rxjs";
import { first, map, mergeMap, take, tap } from "rxjs/operators";
import { ClubsService } from "./clubs.service";

interface clubAdmin {}

@Injectable({
  providedIn: "root",
})
export class ClubAdminGuard implements CanActivate, Resolve<clubAdmin[]> {
  constructor(
    private auth: AuthService,
    private router: Router,
    private clubSvc: ClubsService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): clubAdmin[] | Observable<clubAdmin[]> | Promise<clubAdmin[]> {
    return this.auth.isAuthenticated$.pipe(
      mergeMap((v) => {
        if (v) {
          return this.clubSvc
            .checkAdmin()
            .pipe(map((v) => (v.isAdmin ? v.clubs : [])));
        }
        return of([]);
      }),
      first()
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.isAuthenticated$.pipe(
      mergeMap((v) => {
        if (v) {
          return this.clubSvc
            .checkAdmin()
            .pipe(
              map((v) =>
                v.isAdmin
                  ? true
                  : this.router.createUrlTree(["/admin-confirmation"])
              )
            );
        }
        return this.auth
          .buildAuthorizeUrl({
            redirect_uri: `${window.location.protocol}//${window.location.host}/logged-in`,
            appState: { target: next.routeConfig.path },
            scope: "email openid profile",
          })
          .pipe(
            map((url) => {
              window.open(url, "_self");
              return false;
            })
          );
      })
    );
  }
}

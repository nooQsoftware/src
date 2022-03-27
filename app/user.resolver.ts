import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { Observable, of } from "rxjs";
import { mergeMap, map, first } from "rxjs/operators";
import { ClubsService } from "./clubs.service";

@Injectable()
export class UserResolver
  implements
    Resolve<{
      isAdmin: boolean;
      isSuper: boolean;
    }>
{
  constructor(private auth: AuthService, private clubSvc: ClubsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | { isAdmin: boolean; isSuper: boolean }
    | Observable<{ isAdmin: boolean; isSuper: boolean }>
    | Promise<{ isAdmin: boolean; isSuper: boolean }> {
    return this.auth.isAuthenticated$.pipe(
      mergeMap((v) => {
        if (v) {
          return this.clubSvc
            .checkAdmin()
            .pipe(map((v) => ({ isAdmin: v.isAdmin, isSuper: v.isSuper })));
        }
        return of(null);
      }),
      first()
    );
  }
}

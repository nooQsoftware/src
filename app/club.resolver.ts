import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { Club, ClubsService } from "./clubs.service";

@Injectable()
export class ClubResolver implements Resolve<Club> {
  constructor(private clubSvc: ClubsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Club | Observable<Club> | Promise<Club> {
    return this.clubSvc.detail(Number(route.params.club)).pipe(first());
  }
}

import { Component, HostBinding, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, mergeMap, shareReplay, tap } from "rxjs/operators";
import { adminAuthorisation, ClubsService } from "../clubs.service";

@Component({
  selector: "app-admin-header",
  templateUrl: "./admin-header.component.html",
  styleUrls: ["./admin-header.component.less"],
})
export class AdminHeaderComponent implements OnInit {
  visible: Observable<boolean>;
  admins: Observable<adminAuthorisation[]>;
  club: Observable<{ id?: number; name?: string; approved?: boolean }>;
  isAdmin: boolean;
  constructor(private auth: AuthService, private club_svc: ClubsService) {
    this.visible = auth.isAuthenticated$.pipe(
      mergeMap((v) => {
        if (v) {
          this.admins = club_svc.checkAdmin().pipe(
            tap((ad) => (this.isAdmin = ad.isAdmin)),
            map((adm) => adm.clubs),
            shareReplay(1)
          );
          return this.admins.pipe(map(() => v));
        }
        return of(v);
      })
    );
    this.club = club_svc.activeClub;
  }

  ngOnInit(): void {}

  setAdminGrant(admin) {
    this.club_svc.setActiveClub(admin);
  }

  logout() {
    this.auth.logout();
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { NgxFileDropEntry } from "ngx-file-drop";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, first, map, mergeMap, tap } from "rxjs/operators";

export type Club = {
  id: number | null;
  name: string;
  address: string;
  town: string;
  postcode: string;
  year_start_month: number;
  year_start_day: number;
  email: string;
  max_members: number;
  waiting_list: boolean;
  latitude: number | null;
  longitude: number | null;
  banking?: { payee: string; sortcode: string; account: string };
};

export interface statementDataLine {
  member: { id: number; email: string; name: string; rec_no: number };

  date: Date;
  credit?: number;
  debit?: number;
  type: string;
  selectedId?: number;
  post?: boolean;
  posted: boolean;
  members?: {
    confidence: number;
    entry: {
      id: number;
      email: string;
      name: string;
      rec_no: number;
    };
  }[];
  exluded?: boolean;
  reason?: string;
}

export interface statementData {
  received: boolean;
  id: number;
  fromExisting: boolean;
  data: statementDataLine[];
}

export interface adminAuthorisation {
  id: number;
  name: string;
  approved: boolean;
  club_id?: number;
  email?: string;
  email_verified?: boolean;
  isMe?: boolean;
  isInvitation?: boolean;
}

export interface invitationResponse {
  success: boolean;
  already_registered?: boolean;
  approved?: boolean;
  msg?: string;
}

export interface FinanceReportTableItem {
  date: string;
  amount: number;
  cumulative: number;
  projected: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ClubsService {
  private _active_club = new BehaviorSubject<adminAuthorisation>(null);
  constructor(private http: HttpClient, private auth: AuthService) {}

  financeAll(): Observable<FinanceReportTableItem[]> {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.get<FinanceReportTableItem[]>(`api/reporting/${club_id}`)
      )
    );
  }

  financeHistoric(): Observable<FinanceReportTableItem[]> {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.get<FinanceReportTableItem[]>(
          `api/reporting/${club_id}/historic`
        )
      )
    );
  }

  financeProjected(): Observable<FinanceReportTableItem[]> {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.get<FinanceReportTableItem[]>(
          `api/reporting/${club_id}/projected`
        )
      )
    );
  }

  setBankDetails(d: any): any {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.post<Club[]>(`api/clubs/${club_id}/bank`, d)
      ),
      map((v) => v[0])
    );
  }

  approveAdmin(item: adminAuthorisation) {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.patch(`api/clubs/${club_id}/admins/${item.id}`, {
          approved: true,
        })
      )
    );
  }

  suspendAdmin(item: adminAuthorisation) {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.patch(`api/clubs/${club_id}/admins/${item.id}`, {
          approved: false,
        })
      )
    );
  }

  deleteAdmin(item: adminAuthorisation) {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.delete(`api/clubs/${club_id}/admins/${item.id}`)
      )
    );
  }

  sendInvitation(r: adminAuthorisation): any {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.post<adminAuthorisation>(`api/clubs/${club_id}/admins`, r)
      )
    );
  }

  getAdmins(): Observable<adminAuthorisation[]> {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.get<adminAuthorisation[]>(`api/clubs/${club_id}/admins`)
      )
    );
  }

  registerInvitation(
    club: any,
    invitation: string
  ): Observable<invitationResponse> {
    return this.http.post<invitationResponse>(
      `api/clubs/${club}/register-invitation`,
      {
        invitation,
      }
    );
  }

  getIntegration() {
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.get(`api/clubs/${club_id}/integration`)
      )
    );
  }

  setIntegration(integration: {
    source: string;
    username: string;
    password: string;
    club: number;
  }) {
    if (integration.password == "existing") {
      delete integration.password;
    }
    return this.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.post(`api/clubs/${club_id}/integration`, integration)
      )
    );
  }

  get activeClub() {
    return this._active_club.pipe(filter((v) => v != null));
  }

  get singleClub() {
    return this._active_club.pipe(first((v) => v != null));
  }

  setActiveClub(club: adminAuthorisation): {
    id?: number;
    name?: string;
    approved?: boolean;
  } {
    localStorage.setItem("active_auth", club.id.toString());
    this._active_club.next(club);
    return club;
  }

  checkAdmin(): Observable<{
    clubs?: adminAuthorisation[];
    isAdmin: boolean;
    isSuper: boolean;
  }> {
    return this.auth.getAccessTokenSilently({ detailedResponse: true }).pipe(
      tap((x) => console.log("token", x)),
      mergeMap((token) =>
        this.http.get<{
          clubs?: adminAuthorisation[];
          isAdmin: boolean;
          isSuper: boolean;
        }>("api/clubs/admin", {
          headers: { Authorization: `bearer ${token.id_token}` },
        })
      ),
      tap((v) => {
        if (this._active_club.value == null) {
          if (localStorage.getItem("active_auth") != null) {
            const active_auth = v.clubs.find(
              (c) => c.id == Number(localStorage.getItem("active_auth"))
            );
            if (active_auth != null) {
              this._active_club.next(active_auth);
              return;
            }
          }
          this._active_club.next(v.clubs.find((c) => c.approved));
        }
      })
    );
  }

  postBanking(data: statementData) {
    return this.singleClub.pipe(
      mergeMap((club) =>
        this.http.post<statementData>(
          `api/statements/${club.club_id}/finalise`,
          data
        )
      )
    );
  }

  uploadBanking(
    droppedFile: NgxFileDropEntry,
    file: File
  ): Observable<statementData> {
    const formData = new FormData();
    formData.append("banking", file, droppedFile.relativePath);

    return this.singleClub.pipe(
      mergeMap((club) => {
        return this.http.post<statementData>(
          `api/statements/${club.club_id}/upload`,
          formData
        );
      })
    );
  }

  getIncompleteBanking() {
    return this.activeClub.pipe(
      mergeMap((club) =>
        this.http.get<
          {
            id: number;
            club: number;
            hash: string;
            complete: boolean;
            filename: string;
            uploaded: Date;
            minDate: Date;
            maxDate: Date;
          }[]
        >(`api/statements/${club.club_id}`)
      )
    );
  }

  getExisting(id: number): Observable<statementData> {
    return this.singleClub.pipe(
      mergeMap((club) =>
        this.http.get<statementData>(`api/statements/${club.club_id}/${id}`)
      )
    );
  }

  markStatementComplete(id: number, incomplete: boolean = false) {
    return this.singleClub.pipe(
      mergeMap((club) =>
        this.http.patch(`api/statements/${club.club_id}/${id}`, {
          complete: !incomplete,
        })
      )
    );
  }

  deleteStatementData(id: number) {
    return this.singleClub.pipe(
      mergeMap((club) =>
        this.http.delete(`api/statements/${club.club_id}/${id}`)
      )
    );
  }

  list(): Observable<Club[]> {
    return this.http.get<Club[]>("api/clubs");
  }

  detail(id: number) {
    return this.http.get<Club>(`api/clubs/${id}`);
  }

  add(club: Club) {
    return this.http.post<Club>("api/clubs", club);
  }

  update(data: Club) {
    return this.singleClub.pipe(
      mergeMap((club) => this.http.put<Club>(`api/clubs/${club.club_id}`, data))
    );
  }

  delete(id: number) {
    return this.http.delete<Club>(`api/clubs/${id}`);
  }
}

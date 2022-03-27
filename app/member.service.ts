import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { differenceInCalendarYears } from "date-fns";
import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";
import {
  catchError,
  filter,
  flatMap,
  map,
  mergeMap,
  switchMap,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ClubsService } from "./clubs.service";

export type MemberShipType = {
  id: number;
  title: string;
  constraints?: {
    maxAge?: number;
    minAge?: number;
    minDistance?: number;
  };
  monthly_price: number;
  monthly_product: string;
  annual_price: number;
  annual_product: string;
};

export type MemberShort = {
  id: number;
  club: { id: number; name: string };
  email: string;
  status: number;
  last_name: string;
  first_name: string;
  membership?: {
    id: number;
    title: string;
  };
};

export function isMember(o: any): o is MemberFull {
  return (
    o != null &&
    typeof o.status == "number" &&
    typeof o.id == "number" &&
    typeof o.first_name == "string"
  );
}

export type MemberFull = MemberShort & {
  address: string;
  town: string;
  postcode: string;
  occupation: string;
  proposer: string;
  seconder: string;
  previous_club: string;
  home_club: string;
  current_handicap?: number;
  lowest_handicap?: number;
  cdh_id?: number;
  gender: string;
};

export interface memberAutoResponse {
  email: string;
  id: number;
  name: string;
  person_id: number;
  rec_no: number;
}

@Injectable({
  providedIn: "root",
})
export class MemberService {
  getSchedule(club: number, cust: any): any {
    return this.http.get(`api/payments/${club}/schedule/${cust}`);
  }

  sendLink(row: MemberShort) {
    return this.http.get(`api/payments/sendLink/${row.id}`);
  }

  secure_link: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private club_svc: ClubsService
  ) {}

  postcodeValidator = Validators.pattern(
    /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/i
  );

  getTitles(club: number = 1): Observable<string[]> {
    return this.http.get<string[]>(`api/clubs/${club}/titles`);
  }

  getMemberships(club: number = 1): Observable<MemberShipType[]> {
    return this.http.get<MemberShipType[]>(`api/clubs/${club}/memberships`);
  }

  calculateDistance(
    pcode: string,
    club: number = 1
  ): Observable<number | null> {
    if (pcode == null) return of(null);
    return this.http
      .get<{ long: number; lat: number; dist: number }>(
        `api/clubs/${club}/distance?pcode=${pcode}`
      )
      .pipe(
        map((v) => v.dist),
        catchError((err, caught) => of(null))
      );
  }

  calculateAge(userDateinput: string): { real: number; membership: number } {
    const birthDate = new Date(userDateinput);
    const now = new Date();
    const currentYear = now.getFullYear();
    const thisYear = new Date(currentYear, 11, 31); // note: months start from 0
    const lastYear = new Date(currentYear - 1, 11, 31);
    const memyearstart = now < thisYear ? lastYear : thisYear;
    return {
      real: differenceInCalendarYears(now, birthDate),
      membership: differenceInCalendarYears(memyearstart, birthDate),
    };
  }

  ageValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const v = this.calculateAge(control.value);
      if (v.real < min) {
        return { age: `at least ${min}` };
      }
      if (v.real > max) {
        return { age: `no older than ${max}` };
      }
      return null;
    };
  }

  getMembers(): Observable<MemberShort[]> {
    return this.club_svc.activeClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.get<MemberShort[]>(`api/members/${club_id}`)
      ),
      map((v) =>
        v.map((vx) => {
          let statusText: string;
          switch (vx.status) {
            case 0:
              statusText = "Created";
              break;
            case 1:
              statusText = "Awaiting Payment Details";
              break;
            case 2:
              statusText = "Awaiting Approval";
              break;
            case 3:
              statusText = "Authorised";
              break;
            case 4:
              statusText = "Added to ClubV1";
              break;
            case 5:
              statusText = "Fully Paid Up";
              break;
          }
          return Object.assign(vx, {
            statusText,
            name: `${vx.first_name} ${vx.last_name}`,
          });
        })
      )
    );
  }

  getMemberDetail(member: MemberShort) {
    return this.http
      .get<MemberFull>(`api/members/${member.club.id}/${member.id}`)
      .pipe(map((v) => Object.assign(v, member)));
  }

  validMemberships(
    ageObs: BehaviorSubject<{ real: number; membership: number }>,
    pcodeObs: BehaviorSubject<string>,
    currentMembership: BehaviorSubject<number>,
    club: number = 1
  ): Observable<MemberShipType[]> {
    return combineLatest([
      this.getMemberships(club),
      ageObs,
      pcodeObs.pipe(switchMap((pc) => this.calculateDistance(pc))),
      currentMembership.pipe(filter((v) => v != null)),
    ]).pipe(
      map(([memberships, age, distance, cmv]) => {
        return {
          cmv,
          validMemberships: memberships
            .filter(
              (m) =>
                age != null ||
                (m.constraints?.maxAge == null && m.constraints?.minAge == null)
            )
            .filter(
              (m) => distance != null || m.constraints?.minDistance == null
            )
            .filter(
              (m) =>
                m.constraints?.minDistance == null ||
                m.constraints?.minDistance < distance
            )
            .filter((m) => {
              return (
                m.constraints?.minAge == null ||
                age?.membership >= m.constraints?.minAge
              );
            })
            .filter((m) => {
              return (
                m.constraints?.maxAge == null ||
                age?.membership <= m.constraints?.maxAge
              );
            }),
        };
      }),
      tap((v) => {
        if (v.cmv != 0 && v.validMemberships.every((vx) => vx.id != v.cmv)) {
          currentMembership.next(null);
        }
      }),
      map((v) => v.validMemberships)
    );
  }

  fromSecureLink(): Observable<MemberFull> | null {
    const link =
      this.secure_link ||
      (this.secure_link = sessionStorage.getItem("secure_link"));
    if (link == null) {
      return null;
    }
    return this.http.get<MemberFull>(`api/members/fromLink/${link}`).pipe(
      map((vx) => {
        let statusText: string;
        switch (vx.status) {
          case 0:
          case 1:
            statusText = "Awaiting Payment Details";
            break;
          case 2:
            statusText = "Awaiting Approval";
            break;
          case 3:
            statusText = "Authorised";
            break;
          case 4:
            statusText = "Added to ClubV1";
            break;
          case 5:
            statusText = "Fully Paid Up";
            break;
        }
        return Object.assign(vx, {
          statusText,
          name: `${vx.first_name} ${vx.last_name}`,
        });
      })
    );
  }

  join(data) {
    return this.http
      .post<{ id: number; secure_link: string }>("api/members", data)
      .pipe(
        tap((v) => {
          sessionStorage.setItem("secure_link", v.secure_link);
          this.secure_link = v.secure_link;
        }),
        mergeMap((v) => this.router.navigate(["membership-confirmed"]))
      );
  }

  stageToV1(row: MemberShort) {
    return this.http.get(`api/members/${row.id}/stage`);
  }

  addToV1(row: MemberShort) {
    return this.http.get(`api/members/${row.id}/add`);
  }

  finalisePayment(
    payment_intent: string,
    payment_intent_client_secret: string,
    redirect_status: string
  ) {
    return this.http
      .post<any>("api/members/cardComplete", {
        payment_intent,
        payment_intent_client_secret,
        redirect_status,
      })
      .pipe(
        tap((v) => console.log("finalisePayment", v)),
        tap((r) => this.router.navigate(["membership-confirmed"], {}))
      );
  }

  checkPayment(club: number, cust: string) {
    return this.http.get(`api/payments/${club}/check/${cust}`);
  }

  autoComplete(
    club: number,
    partial: string
  ): Observable<memberAutoResponse[]> {
    return this.http.get<memberAutoResponse[]>(
      `api/members/${club}/autoComplete`,
      {
        params: { partial },
      }
    );
  }
}

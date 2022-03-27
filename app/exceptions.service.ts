import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { mergeMap } from "rxjs/operators";
import { ClubsService } from "./clubs.service";

export type exclusionRequest = {
  club_id: number;
  name?: string;
  notes: string;
  rec_no: number;
};

export type exclusionResponse = exclusionRequest & {
  bill: {
    category: string;
    fees: number;
    locker: number;
    outstanding: number;
    subscription: number;
  };
  bill_member: {
    email: string;
    name: string;
    person_id: number;
    arrangement: any;
  };
};

@Injectable({
  providedIn: "root",
})
export class ExceptionsService {
  constructor(private http: HttpClient, private clubs: ClubsService) {}

  add(v: exclusionRequest): any {
    return this.clubs.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.post(`api/payments/${club_id}/exclusions`, v)
      )
    );
  }

  list() {
    return this.clubs.activeClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.get<exclusionResponse[]>(`api/payments/${club_id}/exclusions`)
      )
    );
  }

  delete(row: exclusionRequest) {
    return this.clubs.singleClub.pipe(
      mergeMap(({ club_id }) =>
        this.http.delete(`api/payments/${club_id}/exclusions/${row.rec_no}`)
      )
    );
  }
}

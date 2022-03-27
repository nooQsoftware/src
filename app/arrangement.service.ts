import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first, mergeMap } from "rxjs/operators";
import { ClubsService } from "./clubs.service";

const api = "api/arrangements";

export interface ArrangementTableItem {
  id: number;
  name?: string;
  email?: string;
  rec_no?: number;
  arrangement: any;
}

@Injectable({
  providedIn: "root",
})
export class ArrangementService {
  sendBill(id: number): any {
    return this.clubs.singleClub.pipe(
      mergeMap((club) =>
        this.http.get(`api/arrangements/${club.club_id}/${id}/email`)
      )
    );
  }
  constructor(private http: HttpClient, private clubs: ClubsService) {}

  delete(id: number): any {
    return this.clubs.singleClub.pipe(
      mergeMap((club) =>
        this.http.delete(`api/arrangements/${club.club_id}/${id}`)
      )
    );
  }

  update(id: number, arrangement: ArrangementTableItem): any {
    return this.clubs.singleClub.pipe(
      mergeMap((club) =>
        this.http.patch(`api/arrangements/${club.club_id}/${id}`, arrangement)
      )
    );
  }

  list() {
    return this.clubs.activeClub.pipe(
      mergeMap((club) =>
        this.http.get<ArrangementTableItem[]>(`${api}/${club.club_id}`)
      )
    );
  }
}

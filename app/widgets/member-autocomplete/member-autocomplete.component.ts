import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Observable, of } from "rxjs";
import { first, mergeMap, startWith } from "rxjs/operators";
import { ClubsService } from "src/app/clubs.service";
import { memberAutoResponse, MemberService } from "src/app/member.service";

@Component({
  selector: "app-member-autocomplete",
  templateUrl: "./member-autocomplete.component.html",
  styleUrls: ["./member-autocomplete.component.less"],
})
export class MemberAutocompleteComponent implements OnInit {
  memberList: Observable<any>;
  fc = new FormControl();
  club: Observable<
    import("/srv/nooqgolf/src/app/clubs.service").adminAuthorisation
  >;

  @Output()
  memberSelected = new EventEmitter<memberAutoResponse>();

  constructor(private svc: MemberService, clubSvc: ClubsService) {
    this.club = clubSvc.activeClub;
  }

  ngOnInit(): void {
    this.memberList = this.fc.valueChanges.pipe(
      mergeMap((v) =>
        typeof v == "string"
          ? this.club.pipe(
              first(),
              mergeMap((club) => this.svc.autoComplete(club.club_id, v))
            )
          : of([v])
      )
    );
  }

  memberDisplay(v: { name: string }) {
    return v?.name;
  }

  selectComplete(evt: MatAutocompleteSelectedEvent) {
    console.log("selectComplete", evt.option.value);
    this.memberSelected.next(evt.option.value);
  }
}

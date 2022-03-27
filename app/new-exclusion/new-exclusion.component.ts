import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { startWith, mergeMap, tap } from "rxjs/operators";
import { adminAuthorisation, ClubsService } from "../clubs.service";
import { exclusionRequest } from "../exceptions.service";
import { MemberService } from "../member.service";

@Component({
  selector: "app-new-exclusion",
  templateUrl: "./new-exclusion.component.html",
  styleUrls: ["./new-exclusion.component.less"],
})
export class NewExclusionComponent implements OnInit {
  group: FormGroup;
  memberList: any;
  club: Observable<adminAuthorisation>;
  constructor(
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialogRef<NewExclusionComponent, exclusionRequest>,
    private svc: MemberService,
    club_Svc: ClubsService
  ) {
    this.group = fb.group({
      member: [null, Validators.required],
      notes: [null, Validators.required],
      club_id: [null, Validators.required],
    });
    this.club = club_Svc.singleClub;
  }

  ngOnInit(): void {
    this.memberList = this.group.controls.member.valueChanges.pipe(
      startWith(""),
      mergeMap((v) =>
        typeof v == "string"
          ? this.club.pipe(
              tap(({ club_id }) => this.group.patchValue({ club_id })),
              mergeMap(({ club_id }) => this.svc.autoComplete(club_id, v))
            )
          : of([v])
      )
    );
  }

  save() {
    const {club_id,notes,member}:{club_id:number,notes:string, member:{rec_no:number}}=this.group.value;
    this.dialog.close({club_id,notes,rec_no:member.rec_no});
  }

  close() {
    this.dialog.close();
  }

  memberDisplay(v: { name: string }) {
    return v?.name;
  }
}

import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { startWith, mergeMap, first } from "rxjs/operators";
import { ArrangementTableItem } from "../arrangement.service";
import { ClubsService } from "../clubs.service";
import { MemberService } from "../member.service";

@Component({
  selector: "app-arrangement-dialog",
  templateUrl: "./arrangement-dialog.component.html",
  styleUrls: ["./arrangement-dialog.component.less"],
})
export class ArrangementDialogComponent implements OnInit {
  mode: "insert" | "update";
  grp: FormGroup;
  memberList: Observable<any>;
  club: Observable<
    import("/srv/nooqgolf/src/app/clubs.service").adminAuthorisation
  >;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ArrangementTableItem,
    private dialog: MatDialogRef<
      ArrangementDialogComponent,
      ArrangementTableItem
    >,
    private svc: MemberService,
    private club_Svc: ClubsService,
    fb: FormBuilder
  ) {
    this.mode = data == null ? "insert" : "update";
    this.club = club_Svc.activeClub.pipe(first());
    this.grp = fb.group({
      member: [null, this.mode == "insert" ? [Validators.required] : []],
      email: data?.email,
      id: data?.id,
      name: data?.name,
      rec_no: data?.rec_no,
      evenPayments: data?.arrangement?.evenPayments ?? false,
      initial: [
        data?.arrangement?.initial,
        [Validators.pattern(/^(\d{1,3}|\d{1,3}\.\d{0,2})$/)],
      ],
      installments: [
        data?.arrangement?.installments,
        [
          Validators.min(0),
          Validators.max(12),
          Validators.pattern(/^\d{1,2}$/),
        ],
      ],
      startMonth: [data?.arrangement?.startMonth],
    });
  }

  ngOnInit(): void {
    this.memberList = this.grp.controls.member.valueChanges.pipe(
      startWith(""),
      mergeMap((v) =>
        typeof v == "string"
          ? this.club.pipe(
              mergeMap((club) => this.svc.autoComplete(club.club_id, v))
            )
          : of([v])
      )
    );
  }

  close() {
    this.dialog.close();
  }

  save() {
    const id = this.mode == "insert" ? this.grp.value.member.id : this.data.id;
    const arrangement: { [key: string]: any } = {};
    if (this.grp.value.evenPayments) arrangement.evenPayments = true;
    if (this.grp.value.initial)
      arrangement.initial = Number(this.grp.value.initial);
    if (this.grp.value.installments)
      arrangement.installments = Number(this.grp.value.installments);
    if (this.grp.value.startMonth)
      arrangement.startMonth = Number(this.grp.value.startMonth);
    this.dialog.close({ id, arrangement });
  }

  clearInitial() {
    this.grp.patchValue({ initial: null });
  }

  clearInstallments() {
    this.grp.patchValue({ installments: null });
  }

  memberDisplay(v: { name: string }) {
    return v?.name;
  }
}

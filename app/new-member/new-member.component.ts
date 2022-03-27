import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MemberService, MemberShipType } from "../member.service";
import { filter, map, tap } from "rxjs/operators";
import { BehaviorSubject, Observable, Subject, timer } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Club } from "../clubs.service";

@Component({
  selector: "app-new-member",
  templateUrl: "./new-member-md.component.html",
  styleUrls: ["./new-member.component.less"],
})
export class NewMemberComponent implements OnInit {
  titles: Observable<string[]>;
  newMemberGroup: FormGroup;
  age = new BehaviorSubject<{ real: number; membership: number }>(null);
  pCode = new BehaviorSubject<string>(null);
  memberships: Observable<MemberShipType[]>;
  membershipValue = new BehaviorSubject<number>(0);
  payNow: boolean;
  payReady: boolean;
  terms: () => boolean;
  club: Observable<Club>;

  constructor(
    fb: FormBuilder,
    route: ActivatedRoute,
    private svc: MemberService,
    private router: Router
  ) {
    this.club = route.data.pipe(
      map((d) => d.club),
      tap((club: Club) => {
        this.titles = svc.getTitles(club.id);
        this.memberships = this.svc.validMemberships(
          this.age,
          this.pCode,
          this.membershipValue,
          club.id
        );
        this.newMemberGroup = fb.group({
          club: [club.id],
          title: ["", Validators.required],
          firstName: [
            "",
            [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(40),
            ],
          ],
          lastName: [
            "",
            [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(40),
            ],
          ],
          dob: ["", [Validators.required, this.svc.ageValidator(4, 110)]],
          email: ["", [Validators.required, Validators.email]],
          address: ["", Validators.required],
          town: ["", Validators.required],
          pcode: ["", [Validators.required, this.svc.postcodeValidator]],
          currHC: [
            null,
            [
              Validators.min(-6),
              Validators.max(48),
              Validators.pattern(/\-?\d{1,2}/),
            ],
          ],
          lowestHC: [null, [Validators.min(-6), Validators.max(48)]],
          membership: ["", [Validators.required]],
          rules: [null, [Validators.requiredTrue]],
          gender: ["", [Validators.required]],
          phone: ["", [Validators.required]],
          occupation: [null, [Validators.maxLength(50)]],
          proposer: [null, [Validators.maxLength(50)]],
          seconder: [null, [Validators.maxLength(50)]],
          previous_club: [null, [Validators.maxLength(50)]],
          home_club: [null, [Validators.maxLength(50)]],
          cdh_id: [null, [Validators.maxLength(10)]],
          reason: [null],
        });
      })
    );
    this.membershipValue
      .pipe(
        filter((v) => v == null),
        tap(() => this.newMemberGroup.patchValue({ membership: null }))
      )
      .subscribe();
  }

  ngOnInit() {}

  errMapper(formControlName: string, label: string) {
    const ctrl = this.newMemberGroup.controls[formControlName];
    if (ctrl.valid) return null;
    if (ctrl.hasError("required")) return `${label} is required`;
    if (ctrl.hasError("email")) return `Invalid email address`;
    if (ctrl.hasError("pattern")) return `Invalid ${label}`;
    if (ctrl.hasError("minlength"))
      return `${label} too short (${ctrl.errors.minlength.requiredLength})`;
    if (ctrl.hasError("maxlength"))
      return `${label} too long (${ctrl.errors.maxlength.requiredLength})`;
  }

  setDob(val: string): void {
    this.age.next(this.svc.calculateAge(val));
  }

  setPCode(val: string) {
    this.pCode.next(val);
  }

  membershipChange(val) {
    if (val != null) {
      console.log(val, this.membershipValue.value);
      this.membershipValue.next(val);
    }
  }

  protected joinComplete = new Subject();

  join(evt) {
    if (this.newMemberGroup.valid) {
      // this.payNow = true;
      this.svc.join(this.newMemberGroup.value).subscribe();
    } else {
      this.terms = true.valueOf;
      this.newMemberGroup.markAllAsTouched();
      timer(200).subscribe((v) => this.joinComplete.next());
    }
  }
}

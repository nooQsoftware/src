import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { MemberService, MemberShipType } from "../member.service";

@Component({
  selector: "app-existing-member",
  templateUrl: "./existing-member.component.html",
  styleUrls: ["./existing-member.component.less"],
})
export class ExistingMemberComponent implements OnInit {
  titles = this.svc.getTitles();
  existingMemberGroup: FormGroup;
  age = new BehaviorSubject<{ real: number; membership: number }>(null);
  pCode = new BehaviorSubject<string>(null);
  memberships: Observable<MemberShipType[]>;
  membershipValue = new BehaviorSubject<number>(0);
  constructor(fb: FormBuilder, private svc: MemberService) {
    this.existingMemberGroup = fb.group({
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
      dob: [null, [Validators.required, this.svc.ageValidator(4, 110)]],
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
      cdhid: [""],
      membership: ["0", [Validators.required]],
      rules: [null, [Validators.requiredTrue]],
    });
    this.memberships = this.svc.validMemberships(
      this.age,
      this.pCode,
      this.membershipValue
    );
    this.membershipValue
      .pipe(
        filter((v) => v == null),
        tap(() => this.existingMemberGroup.patchValue({ membership: null }))
      )
      .subscribe();
  }

  ngOnInit() {}

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

  rejoin(evt) {
    if (this.existingMemberGroup.valid) {
      console.log("Rejoin with data", this.existingMemberGroup.value);
    }
  }
}

import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MemberService } from "../member.service";

@Component({
  selector: "app-new-member-stepper",
  templateUrl: "./new-member-stepper.component.html",
  styleUrls: ["./new-member-stepper.component.less"],
})
export class NewMemberStepperComponent implements OnInit {
  grp: FormGroup;
  ctrl: { [key: string]: AbstractControl } = {};

  constructor(fb: FormBuilder, private svc: MemberService) {
    this.grp = fb.group({
      basics: fb.group({
        title: ["Mr", Validators.required],
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
        dob: [
          "1965-04-12",
          [Validators.required, this.svc.ageValidator(4, 110)],
        ],
        gender: ["", [Validators.required]],
      }),
      contact: fb.group({
        address: ["", Validators.required],
        town: ["", Validators.required],
        pcode: ["", [Validators.required, this.svc.postcodeValidator]],
        phone: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
      }),
      history: fb.group({
        currHC: [null, [Validators.min(-6), Validators.max(48)]],
        lowestHC: [null, [Validators.min(-6), Validators.max(48)]],
        membership: [0, [Validators.required]],
        rules: [null, [Validators.requiredTrue]],
      }),
    });
    Object.keys(this.grp.controls).forEach((g) =>
      Object.keys((this.grp.controls[g] as FormGroup).controls).forEach(
        (c) => (this.ctrl[c] = (this.grp.controls[g] as FormGroup).controls[c])
      )
    );
    console.log("ctrls", this.ctrl);
  }

  ngOnInit(): void {}

  checkErrors() {
    console.log(this.grp.errors);
  }

  errs(ctrl: AbstractControl) {
    if (ctrl.hasError("required")) {
      return "Value required";
    }
    if (ctrl.hasError("email")) {
      return "Invalid email address";
    }
    if (ctrl.hasError("minLength")) {
      return `Value must be at least ${ctrl.errors.minLength.requiredLength} characters long`;
    }
  }
}

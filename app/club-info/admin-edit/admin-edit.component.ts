import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { adminAuthorisation } from "src/app/clubs.service";

@Component({
  selector: "app-admin-edit",
  templateUrl: "./admin-edit.component.html",
  styleUrls: ["./admin-edit.component.less"],
})
export class AdminEditComponent implements OnInit {
  grp: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: adminAuthorisation,
    protected dialogRef: MatDialogRef<AdminEditComponent, adminAuthorisation>,
    fb: FormBuilder
  ) {
    this.grp = fb.group({
      id: new FormControl({ value: data?.id, disabled: data == null }),
      name: [data?.name, [Validators.required]],
      email: new FormControl(
        {
          value: data?.email,
          disabled: !(data?.isInvitation ?? true),
        },
        [Validators.required, Validators.email]
      ),
    });
  }

  ngOnInit(): void {}

  save() {
    this.dialogRef.close(this.grp.value);
  }
}

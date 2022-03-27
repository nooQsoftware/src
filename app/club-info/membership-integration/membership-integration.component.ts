import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface IntegrationData {
  source: string;
  username: string;
  password: string;
}

@Component({
  selector: "app-membership-integration",
  templateUrl: "./membership-integration.component.html",
  styleUrls: ["./membership-integration.component.less"],
})
export class MembershipIntegrationComponent implements OnInit {
  grp: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: IntegrationData,
    private dialogRef: MatDialogRef<
      MembershipIntegrationComponent,
      IntegrationData
    >,
    fb: FormBuilder
  ) {
    this.grp = fb.group({
      source: [data?.source, [Validators.required]],
      username: [data?.username, [Validators.required]],
      password: [data?.password, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  save() {
    this.dialogRef.close(this.grp.value);
  }
}

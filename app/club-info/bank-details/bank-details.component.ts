import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface BankDetails {
  payee: string;
  sort: string;
  account: string;
  name;
}

@Component({
  selector: "app-bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["./bank-details.component.less"],
})
export class BankDetailsComponent implements OnInit {
  grp: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<BankDetailsComponent, BankDetails>,
    fb: FormBuilder
  ) {
    this.grp = fb.group({
      payee: [data?.payee, [Validators.maxLength(18), Validators.minLength(4)]],
      sort: [
        data?.sort,
        [Validators.required, Validators.pattern(/^\d{2}-\d{2}-\d{2}$/)],
      ],
      account: [
        data?.account,
        [Validators.required, Validators.pattern(/^\d{8}$/)],
      ],
      name: [data?.name],
    });
  }

  ngOnInit(): void {}

  save() {
    const { name, ...data } = this.grp.value;
    this.dialogRef.close(data);
  }
}

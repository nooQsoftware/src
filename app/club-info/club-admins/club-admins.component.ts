import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-club-admins",
  templateUrl: "./club-admins.component.html",
  styleUrls: ["./club-admins.component.less"],
})
export class ClubAdminsComponent implements OnInit {
  constructor(protected dialogRef: MatDialogRef<ClubAdminsComponent>) {}

  ngOnInit(): void {}
}

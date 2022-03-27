import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { MemberFull, MemberService, MemberShort } from "../member.service";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.less"],
})
export class MemberListComponent implements OnInit {
  memb: MemberFull;

  constructor(private svc: MemberService) {
  }

  ngOnInit(): void {}

  showDetail(member: MemberShort) {
    if (member != null) {
      this.svc
        .getMemberDetail(member)
        .pipe(tap((v) => (this.memb = v)))
        .subscribe();
    }
  }
}

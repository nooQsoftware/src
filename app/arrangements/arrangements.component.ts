import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { Observable, of } from "rxjs";
import { mergeMap, startWith } from "rxjs/operators";
import { MemberService } from "../member.service";

@Component({
  selector: "app-arrangements",
  templateUrl: "./arrangements.component.html",
  styleUrls: ["./arrangements.component.less"],
})
export class ArrangementsComponent implements OnInit {

  constructor(private svc: MemberService) {}

  ngOnInit(): void {
  }

}

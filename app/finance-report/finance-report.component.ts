import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { FileSaverService } from "ngx-filesaver";
import { Observable, of, Subject } from "rxjs";
import {
  map,
  mergeMap,
  share,
  startWith,
  takeUntil,
  tap,
} from "rxjs/operators";
import { ClubsService, FinanceReportTableItem } from "../clubs.service";

@Component({
  selector: "app-finance-report",
  templateUrl: "./finance-report.component.html",
  styleUrls: ["./finance-report.component.less"],
})
export class FinanceReportComponent implements OnInit, OnDestroy {
  data: Observable<FinanceReportTableItem[]>;
  current: FinanceReportTableItem[];
  filterType = new FormControl("all", Validators.required);
  unsubber = new Subject();
  constructor(private svc: ClubsService, private fileSaver: FileSaverService) {
    this.data = this.filterType.valueChanges.pipe(
      startWith("all"),
      takeUntil(this.unsubber),
      mergeMap((filterType) => {
        switch (filterType) {
          case "all":
            return svc.financeAll();
          case "historic":
            return svc.financeHistoric();
          case "future":
            return svc.financeProjected();
        }
      }),
      tap((v) => (this.current = v)),
      share()
    );
  }

  download() {
    const defaultProjected = this.filterType.value == "future" ? true : false;
    const v = [
      '"Date","Value","Cumulative","Is Projected"',
      ...this.current.map(
        (vx) =>
          `${vx.date},${vx.amount},${vx.cumulative},${
            vx.projected ?? defaultProjected
          }`
      ),
    ];
    const asString = v.reduce((s, c) => {
      return s.concat(c, "\n");
    }, "");
    const asBlob = new Blob([asString], {
      type: "text/csv",
    });
    this.fileSaver.save(
      asBlob,
      `${new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace("T", "-")
        .split(".")
        .shift()}-${this.filterType.value}.csv`
    );
  }

  ngOnDestroy(): void {
    this.unsubber.next();
  }

  ngOnInit(): void {}
}

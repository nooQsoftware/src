import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Observable, of } from "rxjs";
import { map, mergeMap, tap } from "rxjs/operators";
import { MemberService } from "../member.service";

const club = 1; //TODO: add value to URL and replace with value from URL

@Component({
  selector: "app-payment-complete",
  templateUrl: "./payment-complete.component.html",
  styleUrls: ["./payment-complete.component.less"],
})
export class PaymentCompleteComponent implements OnInit {
  data: Observable<any>;
  staticInfo: any;

  constructor(route: ActivatedRoute, svc: MemberService) {
    combineLatest([route.data, route.params, route.queryParams])
      .pipe(
        map(([data, params, query]) => Object.assign(data, params, query)),
        mergeMap((r) => {
          if (r.mode == "confirmed") {
            return svc
              .checkPayment(r.club ?? club, r.cust)
              .pipe(map((cp) => Object.assign(cp, r)));
          }
          return svc.getSchedule(r.club ?? club, r.cust).pipe(
            map((cp) => Object.assign({},r,cp)),
            tap((v) => console.log("cancelled", v))
          );
        }),
        tap((v) => (this.staticInfo = v))
      )
      .subscribe();
  }

  ngOnInit(): void {}

  total(payments: { amount: number }[]) {
    return payments.reduce((s, c) => Math.round((s + c.amount) * 100) / 100, 0);
  }
}

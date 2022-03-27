import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { mergeMap, tap } from "rxjs/operators";
import { MemberService } from "../member.service";

@Component({
  selector: "app-payment-confirmed",
  templateUrl: "./payment-confirmed.component.html",
  styleUrls: ["./payment-confirmed.component.less"],
})
export class PaymentConfirmedComponent implements OnInit {
  constructor(
    private svc: MemberService,
    route: ActivatedRoute,
    router: Router
  ) {
    route.queryParams
      .pipe(
        mergeMap(
          ({
            payment_intent,
            payment_intent_client_secret,
            redirect_status,
          }: {
            payment_intent: string;
            payment_intent_client_secret: string;
            redirect_status: string;
          }) =>
            svc.finalisePayment(
              payment_intent,
              payment_intent_client_secret,
              redirect_status
            )
        ),
      )
      .subscribe();
  }

  ngOnInit(): void {}
}

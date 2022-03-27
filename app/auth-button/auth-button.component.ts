import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { Observable } from "rxjs";

@Component({
  selector: "app-auth-button",
  templateUrl: "./auth-button.component.html",
  styleUrls: ["./auth-button.component.less"],
})
export class AuthButtonComponent implements OnInit {
  isAuthenticated: Observable<boolean>;

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected auth: AuthService
  ) {
    this.isAuthenticated = auth.isAuthenticated$;
  }

  ngOnInit(): void {}
}

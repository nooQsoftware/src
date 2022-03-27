import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@auth0/auth0-angular";
import { AdminConfirmationComponent } from "./admin-confirmation/admin-confirmation.component";
import { ArrangementsComponent } from "./arrangements/arrangements.component";
import { BankingComponent } from "./banking/banking.component";
import { BillExclusionsComponent } from "./bill-exclusions/bill-exclusions.component";
import { ClubAdminGuard } from "./club-admin.guard";
import { ClubInfoComponent } from "./club-info/club-info.component";
import { ClubResolver } from "./club.resolver";
import { ExistingMemberComponent } from "./existing-member/existing-member.component";
import { FinanceReportComponent } from "./finance-report/finance-report.component";
import { LoggedInComponent } from "./logged-in/logged-in.component";
import { MemberListComponent } from "./member-list/member-list.component";
import { MembershipConfirmedComponent } from "./membership-confirmed/membership-confirmed.component";
import { NewMemberStepperComponent } from "./new-member-stepper/new-member-stepper.component";
import { NewMemberComponent } from "./new-member/new-member.component";
import { PaymentCompleteComponent } from "./payment-complete/payment-complete.component";
import { PaymentConfirmedComponent } from "./payment-confirmed/payment-confirmed.component";
import { TokenGuardGuard } from "./token-guard.guard";
import { UserResolver } from "./user.resolver";

const routes: Routes = [
  // { path: "", redirectTo: "membership-confirmed", pathMatch: "full" },
  {
    path: ":club/new-member",
    component: NewMemberComponent,
    resolve: { club: ClubResolver },
  },
  {
    path: "new-member-2",
    component: NewMemberStepperComponent,
  },
  { path: "existing-member", component: ExistingMemberComponent },
  { path: "cardComplete", component: PaymentConfirmedComponent },
  {
    path: "membership-confirmed",
    component: MembershipConfirmedComponent,
    canActivate: [TokenGuardGuard],
  },
  {
    path: "pending-applicants",
    component: MemberListComponent,
    canActivate: [ClubAdminGuard],
  },
  {
    path: "logged-in",
    component: LoggedInComponent,
  },
  {
    path: "payment-complete/:cust",
    component: PaymentCompleteComponent,
    data: { mode: "confirmed" },
  },
  {
    path: "payment-cancelled/:cust",
    component: PaymentCompleteComponent,
    data: { mode: "cancelled" },
  },
  {
    path: "payment-complete/:club/:cust",
    component: PaymentCompleteComponent,
    data: { mode: "confirmed" },
  },
  {
    path: "payment-cancelled/:club/:cust",
    component: PaymentCompleteComponent,
    data: { mode: "cancelled" },
  },
  {
    path: "banking",
    component: BankingComponent,
    canActivate: [ClubAdminGuard],
    resolve: { clubs: ClubAdminGuard },
  },
  {
    path: "club-info",
    component: ClubInfoComponent,
    canActivate: [ClubAdminGuard],
    resolve: { clubs: ClubAdminGuard, user: UserResolver },
  },
  { path: "admin-confirmation", component: AdminConfirmationComponent },
  {
    path: "arrangements",
    component: ArrangementsComponent,
    canActivate: [ClubAdminGuard],
    resolve: { clubs: ClubAdminGuard },
  },
  {
    path: ":club/admin-invitation",
    component: LoggedInComponent,
    data: { state: "before" },
  },
  {
    path: ":club/admin-confirmation",
    component: LoggedInComponent,
    data: { state: "after" },
  },
  {
    path: "finance-report",
    component: FinanceReportComponent,
    canActivate: [ClubAdminGuard],
    resolve: { clubs: ClubAdminGuard },
  },
  {
    path: "exclusions",
    component: BillExclusionsComponent,
    canActivate: [ClubAdminGuard],
    resolve: { clubs: ClubAdminGuard },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

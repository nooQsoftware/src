import { BrowserModule, DomSanitizer } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NewMemberComponent } from "./new-member/new-member.component";
import { ExistingMemberComponent } from "./existing-member/existing-member.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  CUSTOM_ERROR_MESSAGES,
  NgBootstrapFormValidationModule,
} from "ng-bootstrap-form-validation";
import { CUSTOM_ERRORS } from "./custome-errors";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { PaymentConfirmedComponent } from "./payment-confirmed/payment-confirmed.component";
import { MembershipConfirmedComponent } from "./membership-confirmed/membership-confirmed.component";
import { ClubListComponent } from "./club-list/club-list.component";
import { MemberListComponent } from "./member-list/member-list.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MemberTableComponent } from "./member-table/member-table.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatStepperModule } from "@angular/material/stepper";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NewMemberStepperComponent } from "./new-member-stepper/new-member-stepper.component";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AuthHttpInterceptor, AuthModule } from "@auth0/auth0-angular";
import { AuthButtonComponent } from "./auth-button/auth-button.component";
import { LoggedInComponent } from "./logged-in/logged-in.component";
import { BillsComponent } from "./bills/bills.component";
import { PaymentCompleteComponent } from "./payment-complete/payment-complete.component";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { BankingComponent } from "./banking/banking.component";
import { NgxFileDropModule } from "ngx-file-drop";
import { ServerAuthInterceptor } from "./server-auth.interceptor";
import { AdminHeaderComponent } from "./admin-header/admin-header.component";
import { AdminConfirmationComponent } from "./admin-confirmation/admin-confirmation.component";
import { DebounceDirective } from "./debounce.directive";
import { ArrangementsComponent } from "./arrangements/arrangements.component";
import { ArrangementTableComponent } from "./arrangement-table/arrangement-table.component";
import { ArrangementDialogComponent } from "./arrangement-dialog/arrangement-dialog.component";
import { ClubInfoComponent } from "./club-info/club-info.component";
import { UserResolver } from "./user.resolver";
import { BankDetailsComponent } from "./club-info/bank-details/bank-details.component";
import { MembershipIntegrationComponent } from "./club-info/membership-integration/membership-integration.component";
import { ClubAdminsComponent } from "./club-info/club-admins/club-admins.component";
import { AdminTableComponent } from "./club-info/admin-table/admin-table.component";
import { AdminEditComponent } from "./club-info/admin-edit/admin-edit.component";
import { MemberAutocompleteComponent } from "./widgets/member-autocomplete/member-autocomplete.component";
import { ClubResolver } from "./club.resolver";
import { FinanceReportComponent } from "./finance-report/finance-report.component";
import { FinanceReportTableComponent } from "./finance-report/finance-report-table/finance-report-table.component";
import { FileSaverModule } from 'ngx-filesaver';
import { BillExclusionsComponent } from './bill-exclusions/bill-exclusions.component';
import { NewExclusionComponent } from './new-exclusion/new-exclusion.component';

@NgModule({
  declarations: [
    AppComponent,
    NewMemberComponent,
    ExistingMemberComponent,
    PaymentConfirmedComponent,
    MembershipConfirmedComponent,
    ClubListComponent,
    MemberListComponent,
    MemberTableComponent,
    NewMemberStepperComponent,
    AuthButtonComponent,
    LoggedInComponent,
    BillsComponent,
    PaymentCompleteComponent,
    BankingComponent,
    AdminHeaderComponent,
    AdminConfirmationComponent,
    DebounceDirective,
    ArrangementsComponent,
    ArrangementTableComponent,
    ArrangementDialogComponent,
    ClubInfoComponent,
    BankDetailsComponent,
    MembershipIntegrationComponent,
    ClubAdminsComponent,
    AdminTableComponent,
    AdminEditComponent,
    MemberAutocompleteComponent,
    FinanceReportComponent,
    FinanceReportTableComponent,
    BillExclusionsComponent,
    NewExclusionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    FileSaverModule,
    NgxFileDropModule,
    AuthModule.forRoot({
      domain: "nooq.eu.auth0.com",
      clientId: "wMnhXDmCDH27m1TvCz2LBItDyRN0RXa4",
      useRefreshTokens: true,
      cacheLocation: "localstorage",
      httpInterceptor: { allowedList: ["https://localhost"] },
      redirectUri: "https://localhost/logged-in",
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerAuthInterceptor,
      multi: true,
    },
    {
      provide: CUSTOM_ERROR_MESSAGES,
      useValue: CUSTOM_ERRORS,
      multi: true,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: "DD/MM/YYYY",
        },
        display: {
          dateInput: "DD/MM/YYYY",
          monthYearLabel: "MMM YYYY",
          dateA11yLabel: "DD/MM/YYYY",
          monthYearA11yLabel: "MMMM YYYY",
        },
      },
    },
    UserResolver,
    ClubResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl("./assets/mdi.svg")
    );
  }
}

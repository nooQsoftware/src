import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { AuthService } from "@auth0/auth0-angular";
import { map, mergeMap } from "rxjs/operators";

@Injectable()
export class ServerAuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith("api"))
      return this.auth.isAuthenticated$.pipe(
        mergeMap((authenticated) =>
          authenticated
            ? this.auth.getAccessTokenSilently({
                detailedResponse: true,
                scope: "email openid profile",
              })
            : of(null)
        ),
        map((token) =>
          token != null
            ? request.clone({
                setHeaders: {
                  Authorization: `Bearer ${token.id_token}`,
                },
              })
            : request
        ),
        mergeMap((req) => {
          return next.handle(req);
        })
      );
    return next.handle(request);
  }
}

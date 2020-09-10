import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { environment } from 'src/environments/environment';

@Injectable()
export class InsertAuthTokenInterceptor implements HttpInterceptor {

    constructor(private adal: MsAdalAngular6Service) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const resource = this.adal.GetResourceForEndpoint(req.url);

        if (req.url.indexOf(environment.apiUrl) === -1 || !resource || !this.adal.isAuthenticated) {
            return next.handle(req);
        }

        return this.adal.acquireToken(resource).pipe(
            mergeMap((token: string) => {
                const authorizedRequest = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${token}`),
                });
                return next.handle(authorizedRequest);
            }));
    }
}

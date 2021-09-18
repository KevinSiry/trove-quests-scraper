import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    token: string = "Mzk4MTU3MjkwNjA1Mzc5NTk0.YRExWA.HKCZqFNeFeu-WVV8N2KsSQGvPi4";
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({ headers: request.headers.set('Authorization', `${this.token}`) });
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        return next.handle(request);
    }
}
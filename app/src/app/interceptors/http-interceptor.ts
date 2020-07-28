import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private storage: Storage
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return from(this.storage.get('token'))
        .pipe(
            switchMap(token => {
                if (token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: token
                        }
                    });
                }

                if (!request.headers.has('Content-Type')) {
                    request = request.clone({
                        setHeaders: {
                            'content-type': 'application/json'
                        }
                    });
                }

                request = request.clone({
                    headers: request.headers.set('Accept', 'application/json')
                });

                request = request.clone({
                    setHeaders: {
                        'Device-origin': 'mobile-app'
                    }
                });

                return next.handle(request).pipe(
                    map((event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {
                            // console.log('event--->>>', event);
                        }
                        return event;
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 401) {
                            if (error.error.success === false) {
                                console.log('Error 401');
                            } else {
                                this.router.navigate(['login']);
                            }
                        }
                        return throwError(error);
                    }));
                })
        )
    }
}

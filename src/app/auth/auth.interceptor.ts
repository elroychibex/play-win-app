import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpInterceptor, HttpEvent, HttpHandler, } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { map, filter, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('No-Auth') === 'true') {
            return next.handle(req.clone());
        }
        if (localStorage.getItem('token') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set('Authorization', btoa(unescape(encodeURIComponent(localStorage.getItem('token')))))
            });
            // return next.handle(clonedreq).pipe(
            //     succ => { },
            //     err => {
            //         if (err.status === 401) {
            //             localStorage.removeItem('token');
            //             localStorage.removeItem('username');
            //             localStorage.removeItem('role');
            //             localStorage.removeItem('checkInValid');
            //             localStorage.removeItem('checkIn');
            //             localStorage.removeItem('checkOut');
            //             this.router.navigate(['/login']);
            //         }
            //     }
            // );
            return next.handle(clonedreq).pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        console.log('401');
                        if (event.status === 401) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('username');
                            localStorage.removeItem('role');
                            this.router.navigate(['/']);
                        }
                    }
                }, error => {
                    console.error('NICE ERROR', error);
                }));

        } else {
            this.router.navigate(['/']);
        }
    }
}

import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class HttpService {
    private apiUrl: string = '';

    constructor(public http: HttpClient) {
        this.apiUrl = environment.apiURL;
    }

    get(url: string, params?: any) {
        /**
         * http get method
         * @param url - url for http request
         * @param params it construct the url with given params
         */
        return this.http.get<any>(this.apiUrl.concat(url), { params })
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    post(url: string, params?: any) {
        /**
         * http get method
         * @param url - url for http request
         * @param params it construct the url with given params
         */
        // this.spinnerService.setSpinnerStatus(true);
        return this.http.post<any>(this.apiUrl.concat(url), params)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    private handleError(error: any) {
        let errorMessage = {};
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = { 'errorCode': error.status, 'Message': error.error };
        }
        return throwError(errorMessage);
    }
}
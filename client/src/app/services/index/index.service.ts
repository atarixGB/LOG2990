import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/index';

    constructor(private http: HttpClient) {}

    basicGet(): Observable<DrawingData | string[]> {
        const url = (this.BASE_URL + '/getAllDrawings') as string;
        return this.http.get<DrawingData | string[]>(url).pipe(catchError(this.handleError));
    }

    basicPost(message: DrawingData): Observable<DrawingData | string[]> {
        const url: string = (this.BASE_URL + '/send') as string;
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: 'text/plain, */*',
                'Content-Type': 'application/json',
            }),
            responseType: 'text' as 'json', // to allow plain text response
        };

        return this.http.post<DrawingData | string[]>(url, message, httpOptions).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<DrawingData | string[]> {
        let errorMessage = 'Erreur inconnue';
        if (error.error instanceof ErrorEvent) {
            // Client-side
            errorMessage = `Erreur: ${error.error.message}`;
        } else {
            // Server-side
            errorMessage = `\Erreur ${error.status}\n${error.message}`;
        }
        return throwError(errorMessage); // throw back to client
    }
}

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

    basicGet(): Observable<DrawingData> {
        return this.http.get<DrawingData>(this.BASE_URL).pipe(
            catchError((error) => {
                console.log('in service ERROR get method', error);
                throw error;
            }),
        );
    }

    basicPost(message: DrawingData): Observable<DrawingData> {
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: 'text/plain, */*',
                'Content-Type': 'application/json',
            }),
            responseType: 'text' as 'json', // to allow plain text response
        };

        return this.http.post<DrawingData>(this.BASE_URL + '/send', message, httpOptions).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<DrawingData> {
        let errorMessage = 'Erreur inconnue';
        if (error.error instanceof ErrorEvent) {
            // Client-side
            errorMessage = `Erreur client: ${error.error.message}`;
        } else {
            // Server-side
            errorMessage = `\nStatus ${error.status}\n${error.message}`;
        }
        return throwError(errorMessage); // throw back to client
    }
}

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@common/communication/message';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/index';

    constructor(private http: HttpClient) {}

    basicGet(): Observable<Message> {
        return this.http.get<Message>(this.BASE_URL).pipe(
            catchError((error) => {
                console.log('in service ERROR get method', error);
                throw error;
            }),
        );
    }

    basicPost(message: Message): Observable<Message> {
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: 'text/plain, */*',
                'Content-Type': 'application/json',
            }),
            responseType: 'text' as 'json', // to allow plain text response
        };

        return this.http.post<Message>(this.BASE_URL + '/send', message, httpOptions).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<Message> {
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

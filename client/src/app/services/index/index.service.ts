import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly BASE_URL: string = 'http://localhost:3000';
    // private readonly INDEX_URL: string = '/api/index';
    private readonly DATABASE_URL: string = '/api/database';
    private readonly DRAWINGS_URL: string = '/drawings';
    private readonly SEND_URL: string = '/send';

    constructor(private http: HttpClient) {}

    // TODO : Retrieve titles and tags from mongodb when database will be done
    getAllDrawingUrls(): Observable<string[]> {
        const url = this.BASE_URL + this.DATABASE_URL + this.DRAWINGS_URL;
        return this.http.get<string[]>(url);
    }

    postDrawing(message: DrawingData): Observable<DrawingData | string[]> {
        const url: string = this.BASE_URL + this.DATABASE_URL + this.SEND_URL;
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: 'text/plain, */*',
                'Content-Type': 'application/json',
            }),
            responseType: 'text' as 'json',
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
            errorMessage = `Erreur ${error.status}\n${error.message}`;
        }
        return throwError(errorMessage); // throw back to client
    }
}

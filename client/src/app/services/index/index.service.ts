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
    private readonly INDEX_URL: string = '/api/index';

    constructor(private http: HttpClient) {
        this.BASE_URL = this.BASE_URL;
    }

    // TODO : Retrieve titles and tags from mongodb when database will be done
    getAllDrawingUrls(): Observable<Map<string, string>> {
        const url = this.BASE_URL + this.INDEX_URL + '/drawings';
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: 'text/plain,*/*',
                'Content-Type': 'application/json',
            }),
            responseType: 'string' as 'json',
        };
        return this.http.get<Map<string, string>>(url, httpOptions);
    }

    getDrawing(imageUrl: string): Observable<Blob> {
        const url = this.BASE_URL + this.INDEX_URL + `/drawings/${imageUrl}`;
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: 'image/webp,*/*',
                'Content-Type': 'application/json',
            }),
            responseType: 'blob' as 'json',
        };
        return this.http.get<Blob>(url, httpOptions);
    }

    postDrawing(message: DrawingData): Observable<DrawingData | string[]> {
        const url: string = (this.BASE_URL + this.INDEX_URL + '/send') as string;
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

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly BASE_URL: string = 'http://localhost:3000';
    private readonly DATABASE_URL: string = '/api/database';
    private readonly DRAWINGS_URL: string = '/drawings';
    private readonly SEND_URL: string = '/send';
    private readonly FILTER_URL: string = '/filters/';
    private readonly PNG: string = '.png';

    constructor(private http: HttpClient) {}

    postDrawing(message: DrawingData): Observable<DrawingData> {
        const url: string = this.BASE_URL + this.DATABASE_URL + this.SEND_URL;
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: 'text/plain, */*',
                'Content-Type': 'application/json',
            }),
            responseType: 'text' as 'json',
        };

        return this.http.post<DrawingData>(url, message, httpOptions).pipe(catchError(this.handleError));
    }

    async deleteDrawingById(id: string): Promise<void> {
        return new Promise<void>((resolve) => {
            const url = this.BASE_URL + this.DATABASE_URL + this.DRAWINGS_URL + `/${id}.png`;
            this.http.delete(url, { responseType: 'text' }).subscribe(
                () => {
                    resolve();
                },
                (error) => {
                    return throwError(error);
                },
            );
        });
    }

    async getAllDrawings(): Promise<Drawing[]> {
        return new Promise<Drawing[]>((resolve) => {
            const url = this.BASE_URL + this.DATABASE_URL;
            return this.http.get<DrawingData[]>(url).subscribe(
                (drawing: DrawingData[]) => {
                    const drawingCard = [];
                    for (let i = 0; i < drawing.length; i++) {
                        const imgURL = this.BASE_URL + this.DATABASE_URL + this.DRAWINGS_URL + '/' + drawing[i]._id + this.PNG;
                        if (imgURL !== undefined) {
                            drawingCard[i] = new Drawing(drawing[i].title, drawing[i].labels!, imgURL);
                        }
                    }
                    resolve(drawingCard);
                },
                (error) => {
                    return throwError(error);
                },
            );
        });
    }

    async searchByTags(tags: string[]): Promise<Drawing[]> {
        if (tags.length > 0) {
            return new Promise<Drawing[]>((resolve) => {
                let url = this.BASE_URL + this.DATABASE_URL + this.DRAWINGS_URL + this.FILTER_URL;
                for (const tag of tags) {
                    url += tag + '-';
                }
                this.http.get<Drawing[]>(url).subscribe((drawings: Drawing[]) => {
                    resolve(drawings);
                    console.log(drawings);
                });
            });
        } else {
            return new Promise<Drawing[]>((resolve) => {
                this.getAllDrawings().then((result) => {
                    resolve(result);
                });
            });
        }
    }

    private handleError(error: HttpErrorResponse): Observable<DrawingData> {
        let errorMessage = 'Erreur inconnue';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Erreur: ${error.error.message}`;
        } else {
            errorMessage = `Erreur: ${error.status}\n${error.message}`;
        }
        return throwError(errorMessage);
    }
}

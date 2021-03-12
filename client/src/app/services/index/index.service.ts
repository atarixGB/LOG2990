import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@common/communication/message';
import { Observable } from 'rxjs';
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
        return this.http.post<Message>(this.BASE_URL + '/send', message).pipe(
            catchError((error) => {
                console.error('in service ERROR post method', error);
                throw error; // throw error back to component
            }),
        );
    }

    // private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    //     return (error: Error): Observable<T> => {
    //         return of(result as T);
    //     };
    // }
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class NewDrawingService {
    private sendCleaner = new Subject<boolean>();

    clearCanva(): void {
        this.sendCleaner.next(true);
    }

    getClear(): Observable<boolean> {
        return this.sendCleaner.asObservable();
    }
}

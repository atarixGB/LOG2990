import { DrawingData } from '@common/communication/drawing-data';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class DateService {
    async currentTime(): Promise<DrawingData> {
        return {
            title: 'Time',
            labels: [],
            height: 0,
            width: 0,
            body: new Date().toString(),
        };
    }
}

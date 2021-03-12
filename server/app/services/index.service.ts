import { TYPES } from '@app/types';
import { Message } from '@common/communication/message';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DateService } from './date.service';

const SAVED_DRAWINGS_PATH = './saved-drawings/';
@injectable()
export class IndexService {
    clientMessages: Message[];
    constructor(@inject(TYPES.DateService) private dateService: DateService) {
        this.clientMessages = [];
    }

    fs = require('fs');

    about(): Message {
        return {
            title: 'Basic Server About Page',
            labels: [],
            body: 'Try calling helloWorld to get the time',
        };
    }

    async helloWorld(): Promise<Message> {
        return this.dateService
            .currentTime()
            .then((timeMessage: Message) => {
                return {
                    title: 'Hello world',
                    labels: [],
                    body: 'Time is ' + timeMessage.body,
                };
            })
            .catch((error: unknown) => {
                console.error('There was an error!!!', error);

                return {
                    title: 'Error',
                    labels: [],
                    body: error as string,
                };
            });
    }

    // TODO : ceci est à titre d'exemple. À enlever pour la remise
    storeMessage(message: Message): void {
        // console.log(message);
        // this.clientMessages.push(message);
        this.storeDrawing(message);
    }

    storeDrawing(message: Message): void {
        const img = message.body;
        const metadata = img.replace(/^data:image\/\w+;base64,/, '');
        const dataBuffer = Buffer.from(metadata, 'base64');
        fs.writeFile(SAVED_DRAWINGS_PATH + message.title + '.png', dataBuffer, (error) => {
            if (error) throw error;
        });
    }

    getAllMessages(): Message[] {
        return this.clientMessages;
    }
}

import { Message } from '@common/communication/message';
import * as fs from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';

const SAVED_DRAWINGS_PATH = './saved-drawings/';
@injectable()
export class IndexService {
    clientMessages: Message[];
    constructor() {
        this.clientMessages = [];
    }

    fs = require('fs');

    about(): Message {
        return {
            title: 'Serveur PolyDessin',
            labels: [],
            body: "Ce serveur permet de sauvegarder les dessins de l'application PolyDessin dans le format base64",
        };
    }

    async lastDrawing(): Promise<Message> {
        return this.getLastMessage()
            .then((message: Message) => {
                return {
                    title: message.title,
                    labels: message.labels,
                    body: message.body,
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
            this.clientMessages.push(message);
        });
    }

    async getLastMessage(): Promise<Message> {
        return this.clientMessages[this.clientMessages.length - 1];
    }

    getAllMessages(): Message[] {
        return this.clientMessages;
    }
}

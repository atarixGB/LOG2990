import { DrawingData } from '@common/communication/drawing-data';
import * as fs from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';

const SAVED_DRAWINGS_PATH = './saved-drawings/';
const IMAGE_FORMAT = 'png';
const DATA_ENCODING = 'base64';
const IMAGE_DATA_PREFIX = /^data:image\/\w+;base64,/;

@injectable()
export class IndexService {
    clientMessages: DrawingData[];
    constructor() {
        this.clientMessages = [];
    }

    fs = require('fs');

    about(): DrawingData {
        return {
            title: 'Serveur PolyDessin',
            labels: [],
            height: 0,
            width: 0,
            body: "Ce serveur permet de sauvegarder les dessins de l'application PolyDessin dans le format base64",
        };
    }

    async lastDrawing(): Promise<DrawingData> {
        return this.getLastMessage()
            .then((message: DrawingData) => {
                return {
                    title: message.title,
                    labels: message.labels,
                    height: message.height,
                    width: message.width,
                    body: message.body,
                };
            })
            .catch((error: unknown) => {
                console.error('There was an error!!!', error);

                return {
                    title: 'Error',
                    labels: [],
                    height: 0,
                    width: 0,
                    body: error as string,
                };
            });
    }

    storeDrawing(message: DrawingData): void {
        const img = message.body;
        const metadata = img.replace(IMAGE_DATA_PREFIX, '');
        const dataBuffer = Buffer.from(metadata, DATA_ENCODING);
        fs.writeFile(SAVED_DRAWINGS_PATH + message.title + `.${IMAGE_FORMAT}`, dataBuffer, (error) => {
            if (error) throw error;
            this.clientMessages.push(message);
        });
    }

    async getLastMessage(): Promise<DrawingData> {
        return this.clientMessages[this.clientMessages.length - 1];
    }

    // TEMPORAIRE
    getAllMessages(): DrawingData[] {
        fs.readdir(SAVED_DRAWINGS_PATH, (error, files) => {
            if (error) {
                throw error;
            }

            files.forEach((file) => {
                console.log(file);
            });
        });
        return this.clientMessages;
    }

    validateString(str: string): boolean {
        const regex = /^[a-z0-9]+$/i;
        const isAlphanumeric = regex.test(str);
        const isValidSize = str.length >= 0 && str.length <= 15;
        return isValidSize && isAlphanumeric;
    }

    validateRequestBody(body: string): boolean {
        return IMAGE_DATA_PREFIX.test(body);
    }
}

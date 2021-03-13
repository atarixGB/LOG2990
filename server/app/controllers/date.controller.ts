import { DateService } from '@app/services/date.service';
import { DrawingData } from '@common/communication/drawing-data';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class DateController {
    router: Router;

    constructor(@inject(TYPES.DateService) private dateService: DateService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Time
         *     description: Time endpoints
         */

        /**
         * @swagger
         *
         * /api/date:
         *   get:
         *     description: Return current time
         *     tags:
         *       - Time
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            this.dateService
                .currentTime()
                .then((time: DrawingData) => {
                    res.json(time);
                })
                .catch((reason: unknown) => {
                    const errorMessage: DrawingData = {
                        title: 'Error',
                        labels: [],
                        height: 0,
                        width: 0,
                        body: reason as string,
                    };
                    res.json(errorMessage);
                });
        });
    }
}

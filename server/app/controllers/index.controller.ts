import { TYPES } from '@app/types';
import { Message } from '@common/communication/message';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IndexService } from '../services/index.service';

const HTTP_STATUS_CREATED = 201;

@injectable()
export class IndexController {
    router: Router;

    constructor(@inject(TYPES.IndexService) private indexService: IndexService) {
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
         *   - name: Index
         *     description: Gestion des requêtes concernant les dessins sauvegardés
         *   - name: Message
         *     description: Messages functions
         */

        /**
         * @swagger
         *
         * /api/index/lastDrawing:
         *   get:
         *     description: Retourne le dernier dessin envoyé sur le serveur
         *     tags:
         *       - Index
         *       - Message
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Succès de la requête
         *         schema:
         *           $ref: '#/definitions/Message'
         *
         */
        this.router.get('/lastDrawing', async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            const time: Message = await this.indexService.lastDrawing();
            res.json(time);
        });

        /**
         * @swagger
         *
         * /api/index/about:
         *   get:
         *     description: Information de base sur le serveur de PolyDessin
         *     tags:
         *       - About
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.get('/about', (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            res.json(this.indexService.about());
        });

        /**
         * @swagger
         *
         * /api/index/send:
         *   post:
         *     description: Send a message
         *     tags:
         *       - Index
         *       - Message
         *     requestBody:
         *         description: message object
         *         required: true
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/Message'
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/send', (req: Request, res: Response, next: NextFunction) => {
            const message: Message = req.body;
            this.indexService.storeDrawing(message);
            res.sendStatus(HTTP_STATUS_CREATED);
        });

        /**
         * @swagger
         *
         * /api/index/all:
         *   get:
         *     description: Return all messages
         *     tags:
         *       - Index
         *       - Message
         *     produces:
         *      - application/json
         *     responses:
         *       200:
         *         description: messages
         *         schema:
         *           type: array
         *           items:
         *             $ref: '#/definitions/Message'
         */
        this.router.get('/all', (req: Request, res: Response, next: NextFunction) => {
            res.json(this.indexService.getAllMessages());
        });
    }
}

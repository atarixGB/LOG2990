import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_NOT_FOUND = 404;
@injectable()
export class DatabaseController {
    router: Router;

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
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
            res.send('Database routing');
        });

        /**
         * @swagger
         *
         * /api/index/drawings:
         *   get:
         *     description: Retourne le titre de tous les dessins sauvegardés sur le serveur
         *     tags:
         *       - Index
         *       - Dessin
         *     produces:
         *      - application/json
         *     responses:
         *       200:
         *         schema:
         *           type: array
         *           items:
         *             $ref: '#/definitions/Message'
         */
        this.router.get('/drawings', (req: Request, res: Response, next: NextFunction) => {
            console.log('Mise à jour:', this.databaseService.drawingURLS);
            res.json(this.databaseService.drawingURLS);
        });

        /**
         * @swagger
         *
         * /api/index/send:
         *   post:
         *     description: Sauvegarde du dessin (canvas) sur le serveur au format PNG (base64)
         *     tags:
         *       - Index
         *       - Sauvegarde
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
            const drawing: DrawingData = req.body;
            this.databaseService
                .addDrawing(drawing)
                .then(() => {
                    res.sendStatus(HTTP_STATUS_CREATED);
                })
                .catch((error: Error) => {
                    res.status(HTTP_STATUS_NOT_FOUND);
                });

            // res.sendStatus(HTTP_STATUS_CREATED);
        });

        /**
         * @swagger
         *
         * /api/index/drawings/:title:
         *   get:
         *     description: Retourne le dessin dont le titre a été spécifié en paramètre
         *     tags:
         *       - Index
         *       - Dessin
         *     produces:
         *      - application/json
         *     responses:
         *       200:
         *         schema:
         *           type: file
         *           items:
         *             $ref: '#/definitions/Message'
         */
        this.router.get('/drawings/:title', (req: Request, res: Response, next: NextFunction) => {
            res.sendFile(req.params.title, { root: 'saved-drawings/' }, (error) => {
                if (error) throw error;
            });
        });
    }
}

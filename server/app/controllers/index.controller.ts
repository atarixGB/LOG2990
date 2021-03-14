import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
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
         *     description: Retourne le dernier dessin envoyé sur le serveur de la session courante
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
            const time: DrawingData = await this.indexService.lastDrawing();
            res.json(time);
        });

        /**
         * @swagger
         *
         * /api/index/about:
         *   get:
         *     description: Information de base sur le serveur de PolyDessin
         *     tags:
         *       - A propos
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.get('/about', (req: Request, res: Response, next: NextFunction) => {
            res.json(this.indexService.about());
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
            const message: DrawingData = req.body;
            this.indexService.storeDrawing(message);
            res.sendStatus(HTTP_STATUS_CREATED);
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
            console.log(`index.controller - /drawings/${req.params.title}`);
            res.sendFile(req.params.title, { root: 'saved-drawings/' }, (error) => {
                if (error) throw error;
            });
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
            console.log('Mise à jour:', this.indexService.getAllDrawingsPath());
            res.json(this.indexService.getAllDrawingsPath());
        });
    }
}

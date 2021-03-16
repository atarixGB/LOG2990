import { TYPES } from '@app/types';
import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { DatabaseController } from './database.controller';

@injectable()
export class IndexController {
    router: Router;

    constructor(@inject(TYPES.DatabaseController) private databaseController: DatabaseController) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.use('/database', this.databaseController.router);
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
    }
}

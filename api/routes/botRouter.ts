// botRouter.ts
import express from 'express';
import botController from '../controllers/botController';
import authenticateToken from '../middleware/authenticateToken';

const botRouter = express.Router();

// Регистрация нового бота
botRouter.post('/', botController.register);
botRouter.get('/:id/dialogs', botController.get_dialogs);
botRouter.post('/:id/create-dialog', botController.create_dialog);
botRouter.get('/', botController.getlist);

export default botRouter;

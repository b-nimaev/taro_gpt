// botRouter.ts
import express from 'express';
import botController from '../controllers/botController';
import authenticateToken from '../middleware/authenticateToken';

const botRouter = express.Router();

// Регистрация нового бота
botRouter.post('/', botController.register);
botRouter.get('/:id/dialogs', botController.get_dialogs);
botRouter.get('/:id/dialog', botController.get_dialog);
botRouter.post('/:id/create-dialog', botController.create_dialog);
botRouter.put('/:dialogId/new-message', botController.new_message);
botRouter.get('/', botController.getlist);
botRouter.delete('/', botController.deleteBots);
botRouter.post('/tuning', botController.tuning);
botRouter.put('/:id/add-user ', botController.addUser);

export default botRouter;

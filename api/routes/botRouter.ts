// botRouter.ts
import express from 'express';
import botController from '../controllers/botController';
import authenticateToken from '../middleware/authenticateToken';

const botRouter = express.Router();

// Регистрация нового бота
botRouter.post('/', botController.register);
botRouter.get('/', botController.getlist);

export default botRouter;

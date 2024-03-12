// chatRouter.ts
import express from 'express';
import chatController from '../controllers/chatController';
import authenticateToken from '../middleware/authenticateToken';

const chatRouter = express.Router();

chatRouter.post('/', chatController.register);
chatRouter.post('/user_is_exists', chatController.user_is_exists);
chatRouter.post('/new-message', chatController.newMesage);
chatRouter.get('/:id/dialog', chatController.get_dialog);
chatRouter.post('/:id/create-dialog', chatController.create_dialog);
chatRouter.put('/:dialogId/new-message', chatController.new_message);

chatRouter.get('/recipients', chatController.getRecipients);
chatRouter.get('/get-recipient/:id', chatController.getRecipient);
chatRouter.get('/', chatController.getlist);

chatRouter.delete('/', chatController.deleteBots);
chatRouter.post('/tuning', chatController.tuning);

export default chatRouter;

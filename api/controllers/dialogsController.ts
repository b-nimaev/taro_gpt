// dialogsController.ts 
import { Request, Response } from 'express';
import logger from "../utils/logger";
import { DialogModel } from '../models/Dialog';

const dialogsController = {
    create: async (req: Request, res: Response) => {
        try {
            
            const { name } = req.body
            
            const dialog = await new DialogModel({
                name
            }).save()

            return res.status(200).json({ message: 'Диалог создан!', dialog })

        } catch {
            logger.error('error')
        }
    },
    getlist: async (req: Request, res: Response) => {
        try {
            
            const dialogs = await DialogModel.find()
            logger.info('Диалоги получены!')
            return res.status(200).json({ message: 'Диалоги получены!', dialogs, count: dialogs.length })

        } catch {
            logger.error('error')
            return res.status(500).json({ message: 'Возникла ошибка при получении диалогов' })
        }
    },
};

export default dialogsController;

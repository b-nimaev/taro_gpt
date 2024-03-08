import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User";
import logger from "../utils/logger";
import Token from "../models/Token";
import { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb";
import isValidObjectIdString from "../utils/isValidObjectIdString";
import { AuthRequest } from "../middleware/authenticateToken";
import Bot from "../models/Bot";
import { DialogModel } from "../models/Dialog";

interface RegisterRequestBody {
  name: string;
  description: string;
}

interface RegisterRequest extends Request {
  body: RegisterRequestBody;
}

const saltRounds = 10;

const botController = {
  register: async (req: RegisterRequest, res: Response) => {
    try {
      const { name, description } = req.body;

      if (name) {
        const existingBotByName = await Bot.findOne({ name });

        if (existingBotByName) {
          logger.error(`Бот с таким name уже существует: ${name}`);
          return res.status(400).json({
            message: `Бот с таким названием уже существует`,
          });
        }
      }

      const newBot = new Bot({ name, description });
      await newBot.save();

      res
        .status(201)
        .json({ message: "Бот успешно зарегистрирован", bot: newBot });
      logger.info(`Успешная регистрация бота: ${newBot._id}`);
    } catch (error) {
      console.error(error);
      logger.error(`Ошибка при регистрации пользователя: ${error.message}`);
      res.status(500).json({ message: "Ошибка при регистрации пользователя" });
    }
  },
  getlist: async (req: Request, res: Response) => {
    try {
      const botlist = await Bot.find();
      res.status(200).json({ message: "Список ботов получен!", botlist });
    } catch (error) {
      console.error(error);
      logger.error(`Ошибка при получении списка ботов: ${error.message}`);
      res.status(500).json({ message: "Ошибка при получении списка ботов" });
    }
  },
  get_dialogs: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const bot = await Bot.findById(new ObjectId(id)).populate("dialogs");;

      logger.info("Диалоги получены!");
      return res
        .status(200)
        .json({ message: "Диалоги получены!", dialogs: bot.dialogs });
    } catch (error) {
      logger.error(`Ошибка при получении диалога: ${error.message}`);
      return res.status(500).json({ message: "Ошибка при получении диалога" });
    }
  },
  create_dialog: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      //   const bot = await DialogModel.findById(new ObjectId(id));
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Укажите название бота!' })
      }

      if (name.length < 1) {
        return res.status(400).json({ message: 'Укажите название бота!' })
      }

      const dialog = await new DialogModel({
        name,
        author: new ObjectId(req.user.userId),
      }).save();

      await Bot.findByIdAndUpdate(new ObjectId(id), {
        $push: {
          dialogs: dialog._id,
        },
      });

      return res.status(200).json({ message: "Диалог создан!", dialog });
    } catch (error) {
      logger.error(`Ошибка при создании диалога: ${error.message}`);
      return res.status(500).json({ message: "Ошибка при создании диалога" });
    }
  },
};

export default botController;

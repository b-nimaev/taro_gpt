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
import { DialogModel, MessageModel } from "../models/Dialog";
import * as fs from "fs";
import fetch from "node-fetch";
import OpenAI, { toFile } from "openai";
import Recipient from "../models/Recipient";

const openai = new OpenAI({
  apiKey: process.env.apikey, // This is the default and can be omitted
});
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
      const bot = await Bot.findById(new ObjectId(id)).populate("dialogs");

      logger.info("Диалоги получены!");
      return res
        .status(200)
        .json({ message: "Диалоги получены!", dialogs: bot.dialogs });
    } catch (error) {
      logger.error(`Ошибка при получении диалога: ${error.message}`);
      return res.status(500).json({ message: "Ошибка при получении диалога" });
    }
  },
  get_dialog: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const isExists = await DialogModel.findById(id).populate("messages");

      if (!isExists) {
        return res.status(404).json({ message: "Диалог не найден" });
      }

      const dialog = await DialogModel.findById(new ObjectId(id)).populate(
        "messages"
      );

      logger.info("Диалог получен!");
      return res.status(200).json({ message: "Диалог получен!", dialog });
    } catch (error) {
      logger.error(`Ошибка при получении диалога: ${error.message}`);
      return res.status(500).json({ message: "Ошибка при получении диалога" });
    }
  },
  deleteBots: async (req: Request, res: Response) => {
    try {
      const { botList } = req.body;
      let deletedItems = [];

      for (const element of botList) {
        const deletedItem = await Bot.findByIdAndDelete(element._id);
        deletedItems.push(deletedItem);
      }

      logger.info("Боты удалены!: " + deletedItems);
      return res.status(200).json({ message: "Боты удалены!", deletedItems });
    } catch (error) {
      logger.error(`Ошибка при получении диалога: ${error.message}`);
      return res.status(500).json({ message: "Ошибка при получении диалога" });
    }
  },
  addUser: async (req: Request, res: Response) => {
    try {

      const { peer } = req.body;
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Неверный формат ID бота" });
      }

      const isExists = await Bot.findById(id)

      if (!isExists) { return res.status(404).json({ message: 'Бот не найден!' }) }

      const newUser = await new Recipient({ telegramUsername: peer }).save()

      // await Bot.findByIdAndUpdate(id)

      return res.status(200).json({ message: "Пользователь добавлен", newUser });
      
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
        return res.status(400).json({ message: "Укажите название бота!" });
      }

      if (name.length < 1) {
        return res.status(400).json({ message: "Укажите название бота!" });
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

  new_message: async (req: AuthRequest, res: Response) => {
    try {
      const { dialogId } = req.params;
      const { assistantMessage, userMessage } = req.body;

      if (!isValidObjectId(dialogId)) {
        return res.status(400).json({ message: "Неверный формат ID диалога" });
      }

      const newUserMessage = {
        role: "user",
        content: userMessage,
      };

      const newAssistantMessage = {
        role: "assistant",
        content: assistantMessage,
      };

      const dialog = await DialogModel.findById(dialogId);
      if (!dialog) {
        return res.status(404).json({ message: "Диалог не найден" });
      }

      const newUserMessageSaveResult = await new MessageModel(
        newUserMessage
      ).save();
      const newAssistantMessageSaveResult = await new MessageModel(
        newAssistantMessage
      ).save();

      await DialogModel.findByIdAndUpdate(dialogId, {
        $push: {
          messages: newUserMessageSaveResult._id,
        },
      }).then(() => {
        logger.info("Сообщение пользователя сохарнено в диалог!");
      });
      await DialogModel.findByIdAndUpdate(dialogId, {
        $push: {
          messages: newAssistantMessageSaveResult._id,
        },
      }).then(() => {
        logger.info("Сообщение бота сохранено в диалог!");
      });

      return res.status(200).json({
        message: "Сообщения добавлены",
        messages: {
          newUserMessageSaveResult,
          newAssistantMessageSaveResult,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ошибка при добавлении сообщения" });
    }
  },
  tuning: async (req: AuthRequest, res: Response) => {
    try {
      const { botList } = req.body;

      const promt = "ты знакомишься и общаешься с парнями";

      // Открываем файл для записи
      const fileStream = fs.createWriteStream("input.jsonl");

      botList.forEach(async (element) => {
        if (!isValidObjectId(element._id)) {
          return res.status(400).json({ message: "Неверный формат ID бота" });
        }

        const bot = await Bot.findById(element._id);
        if (!bot) {
          return res.status(404).json({ message: "Бот не найден" });
        }

        const result = await Bot.findById(element._id).populate("dialogs");
        const dialogs = result.dialogs;

        // Указываем имя файла для записи
        const filename = "data2.jsonl";

        // Очищаем файл перед записью
        clearFile(filename);

        dialogs.forEach(async (dialog: any) => {
          const fetchDialog = await DialogModel.findById(dialog._id).populate(
            "messages"
          );
          const messages: any = [
            {
              messages: fetchDialog.messages,
            },
          ];
          // Записываем данные в файл
          writeJSONL(
            filename,
            messages,
            "Ты знакомишься с парнями. Ты девушка пикапер."
          );
        });
      });

      // Закрываем файл после завершения записи
      fileStream.end();

      const file = await openai.files.create({ file: fs.createReadStream('data2.jsonl'), purpose: 'fine-tune' });
      const fineTune = await openai.fineTuning.jobs.create({ training_file: file.id, model: 'gpt-3.5-turbo' })
      console.log(file)
      console.log(fineTune)

      return res
        .status(200)
        .json({ message: "Данные успешно записаны в файл input.jsonl" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ошибка при добавлении сообщения" });
    }
  },
};

// Функция для очистки файла
function clearFile(filename: string) {
    fs.truncateSync(filename, 0);
}

// Функция для записи JSONL
function writeJSONL(filename: string, data: any[], prompt: string) {

  const lines = data.map((obj) => {
    // Проходим по каждому объекту в массиве messages и берем только ключи role и content
    const selectedMessages = obj.messages.map((message: any) => {
      const { role, content } = message;
      return { role, content };
    });

    // Вставляем элемент с ролью "system" и контентом промпта в начало массива сообщений
    selectedMessages.unshift({ role: "system", content: prompt });

    return JSON.stringify({ messages: selectedMessages });
  });
  fs.appendFileSync(filename, lines.join("\n") + "\n");
}
export default botController;

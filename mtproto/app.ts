import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
const input = require("input"); // npm i input
import { Api } from "telegram/tl";
import OpenAI, { toFile } from "openai";
import fetch from "node-fetch";
import { NewMessage, NewMessageEvent } from "telegram/events";

const url = process.env.url;
const secretKey = Number(process.env.secret_key);

const openai = new OpenAI({
  apiKey: process.env.apikey, // This is the default and can be omitted
});

const apiId = 25018313;
const apiHash = <string>process.env.apiHash;
const stringSession = new StringSession(process.env.session); // fill this later with the value from session.save()

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again

  //   const result = await client.sendMessage("@frntdev", { message: "Hello!" });

  async function eventPrint(event: any) {
    const message = event.message;
    // Checks if it's a private message (from user or bot)
    if (event.isPrivate) {
      // read message
      if (message.text) {
        const sender = await message.getSender();

        const user = {
          firstName: sender.firstName,
          lastName: sender.lastName,
          username: sender.username,
          phone: sender.phone,
          id: sender.id,
        };

        const response = await userIsExists(user)
        
        const savedUser: {
          user: {
            _id: string
          }
        } = await response.json();
        
        await newMessage(savedUser.user._id, message.text).then(async (data) => {
          const completion = await data.json();

          return await sendMessage(user.id, completion.content)

        });

        
        // // @ts-ignore
        // await client.sendMessage(sender, {
        //   message: `<code>/code>`,
        // });
      }
    }
  }

  // adds an event handler for new messages
  client.addEventHandler(eventPrint, new NewMessage({}));

  async function sendMessage(recipient: any, content: string) {
    try {
      const result = await client.sendMessage(recipient, {
        message: content,
      });

      const peerId: any = result.peerId;
      const userId = Number(peerId.userId);

      console.log(`Сообщение отправлено пользователю с ID ${userId}`);
    } catch (error) {
      console.log(`Ошибка при отправлении пользователю ${recipient}`);
      console.log(error);
    }
  }
})();

async function userIsExists(user: any) {
  const requestData = {
    secret_key: secretKey,
    // @ts-ignore
    userId: user.id,
    user,
  };

  return await fetch(`https://drvcash.com/api/chat/user_is_exists`, {
    method: "POST",
    body: JSON.stringify(requestData),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

async function newMessage(documentId: string, message: string) {
  const requestData = {
    secret_key: secretKey,
    // @ts-ignore
    documentId,
    message,
  };

  return await fetch(`https://drvcash.com/api/chat/new-message`, {
    method: "POST",
    body: JSON.stringify(requestData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

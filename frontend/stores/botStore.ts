// stores/botStore.ts
import { defineStore } from "pinia";
import type { ApiError } from "@/types/error";

export const useBotStore = defineStore("bot", {
  state: () => ({
    botName: "",
    botDescription: "",
    selectedBot: "",
    botList: [] as {
      name: string;
      description: string;
      _id: string;
      checkStatus: boolean;
    }[],
    declineSentenceResponse: {
      message: "",
    },
    dialogList: [] as any[],

    activeDialog: {} as {
      _id: string;
      name: string;
    },

    fetchDialogsResult: {} as {
      message: string;
      dialogs: {
        _id: string;
        name: string;
        checkedStatus: boolean;
        messages: {
          content: string;
          role: "assistant" | "system" | "user";
          _id: string;
        }[];
      }[];
    },

    fetchMessagesResult: {} as {
      message: string;
      dialog: {
        _id: string;
        name: string;
        messages: {
          content: string;
          role: "user" | "assistant";
          _id: string;
        }[];
      };
    },

    createDialogName: "",
    createDialogModal: false,
    createDialogResult: {} as {
      message: string;
      dialog: {
        _id: string;
        name: string;
      };
    } | null,

    selected_dialog: [] as {
      content: string;
      role: string;
      _id: string;
    }[],

    isLoading: false,
    isLoadingDeleteBotList: false,
    isLoadingCreateDialog: false,
    isLoadingFetchBotlist: false,
    isLoadingFetchBotDialogs: false,
    isLoadingFetchDialogMessages: false,

    isError: false,
    isErrorDeleteBotList: false,
    isErrorCreateDialog: false,
    isErrorBotlistLoading: false,
    isErrorSelectedDialogLoading: false,
    isErrorFetchingDialogMessages: false,

    error: null as ApiError | null,
    errorDeleteBotList: null as ApiError | null,
    errorCreateDialog: null as ApiError | null,
    errorBotlistLoading: null as ApiError | null,
    errorSelectedDialogLoading: null as ApiError | null,
    errorFetchingDialogMessages: false,

    userMessage: "",
    assistantMessage: "",

    randomSentenceTranslateText: "",
  }),
  actions: {
    async createBot() {
      this.isLoading = true;
      try {
        const response = await fetch("https://drvcash.com/backendapi/bot", {
          method: "post",
          body: JSON.stringify({
            name: this.botName,
            description: this.botDescription,
          }),
          headers: {
            Authorization: `Bearer ${useCookie("token").value}`,
            "Content-Type": "application/json",
          },
        });

        const data: {
          message: string;
          bot: {
            name: string;
            description: string;
            checkStatus: boolean;
            _id: string;
          };
        } = await response.json();

        if (!response.ok) {
          const error = new Error();
          error.message = data.message;
          error.name = "Ошибка";
        } else {
          this.botList.push(data.bot);
          this.botList.forEach((element) => {
            element.checkStatus = false;
          });
          this.botName = "";
          this.botDescription = "";
        }
      } catch (error) {
        if (error instanceof Error) {
          this.error = error;
          this.isError = true;
        } else {
          this.error = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isLoading = false;
      }
    },
    async fetchBotlist() {
      this.botList = [];
      this.isLoadingFetchBotlist = true;
      this.selected_dialog = []; // Очистка списка перед загрузкой
      try {
        const response = await fetch("https://drvcash.com/backendapi/bot", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${useCookie("token").value}`,
            "Content-Type": "application/json",
          },
        });

        const data: {
          message: string;
          botlist: {
            name: string;
            description: string;
            checkStatus: boolean;
            _id: string;
          }[];
        } = await response.json();

        if (!response.ok) {
          const error = new Error();
          error.message = data.message;
          error.name = "Ошибка";
        } else {
          if (data.botlist !== null) {
            for (let i = 0; i < data.botlist.length; i++) {
              const bot = data.botlist[i];
              bot.checkStatus = false;
              this.botList.push(bot);
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          this.errorBotlistLoading = error;
          this.isErrorBotlistLoading = true;
        } else {
          this.errorBotlistLoading = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isLoadingFetchBotlist = false;
      }
    },
    async fetchDialogs(botId: string) {
      this.isLoadingFetchBotDialogs = true;
      this.dialogList = []; // Очистка списка перед загрузкой
      try {
        const response = await fetch(
          `https://drvcash.com/backendapi/bot/${botId}/dialogs`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data: {
          message: string;
          dialogs: {
            _id: string;
            name: string;
            checkedStatus: boolean;
            messages: {
              content: string;
              role: "assistant" | "system" | "user";
              _id: string;
            }[];
          }[];
        } = await response.json();
        if (!response.ok) {
          const error = new Error();
          error.message = data.message;
          error.name = "Ошибка";
        } else {
          this.fetchDialogsResult = data;
          this.fetchDialogsResult.dialogs.forEach((obj) => {
            // Добавляем новое свойство checkedStatus к каждому объекту
            obj.checkedStatus = false; // Здесь вы можете установить значение по умолчанию, если нужно
          });
          if (data.dialogs !== null) {
            console.log(data.dialogs);
            // for (let i = 0; i < data.dialog.messages.length; i++) {
            //   const message = data.dialog.messages[i];
            //   this.selected_dialog.push(message);
            // }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          this.errorSelectedDialogLoading = error;
          this.isErrorSelectedDialogLoading = true;
        } else {
          this.errorSelectedDialogLoading = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isLoadingFetchBotDialogs = false;
      }
    },
    async createDialog() {
      this.createDialogResult = null;
      this.isLoadingCreateDialog = true;

      if (!this.selectedBot) {
        this.isErrorCreateDialog = true;
        this.errorCreateDialog = {
          message: "Выберите бота!",
        };
        return false;
      }

      if (!this.createDialogName) {
        this.isErrorCreateDialog = true;
        this.errorCreateDialog = {
          message: "Укажите название диалога!",
        };
        return false;
      }

      try {
        const response = await fetch(
          `https://drvcash.com/backendapi/bot/${this.selectedBot}/create-dialog`,
          {
            method: "post",
            body: JSON.stringify({
              name: this.createDialogName,
            }),
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data: {
          message: string;
          dialog: {
            _id: string;
            name: string;
          };
        } = await response.json();

        if (!response.ok) {
          const error = new Error();
          error.message = data.message;
          error.name = "Ошибка";
        } else {
          let createdDialog: any = data.dialog;
          createdDialog.checkedStatus = false;
          console.log(createdDialog);

          this.fetchDialogsResult.dialogs.push(createdDialog);

          this.createDialogName = "";
          this.createDialogResult = data;
        }
      } catch (error) {
        if (error instanceof Error) {
          this.errorCreateDialog = error;
          this.isErrorCreateDialog = true;
        } else {
          this.errorCreateDialog = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isLoadingCreateDialog = false;
      }
    },
    toggleDialogCheckStatus(dialogId: string, checked: boolean) {
      const dialog = this.fetchDialogsResult.dialogs.find(
        (s) => s._id === dialogId
      );
      if (dialog) {
        dialog.checkedStatus = checked;
      }
    },
    toggleBotCheckStatus(BotId: string, checked: boolean) {
      const bot = this.botList.find((s) => s._id === BotId);
      if (bot) {
        bot.checkStatus = checked;
      }
    },
    deleteDialogs() {
      const dialogList = this.fetchDialogsResult.dialogs.filter(
        (dialog) => dialog.checkedStatus
      );
      console.log(dialogList);
    },
    async deleteBots() {
      const botList = this.botList.filter((bot) => bot.checkStatus);

      try {
        const response = await fetch("https://drvcash.com/backendapi/bot", {
          method: "DELETE",
          body: JSON.stringify({
            botList: botList,
          }),
          headers: {
            Authorization: `Bearer ${useCookie("token").value}`,
            "Content-Type": "application/json",
          },
        });

        const data: {
          message: string;
          deletedItems: {
            _id: string;
          }[];
        } = await response.json();

        console.log(data);

        if (!response.ok) {
          const error = new Error();
          error.message = data.message;
          error.name = "Ошибка";
        } else {
          this.botList = this.botList.filter(
            (bot) =>
              !data.deletedItems.some(
                (deletedBot) => deletedBot._id === bot._id
              )
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          this.errorBotlistLoading = error;
          this.isErrorBotlistLoading = true;
        } else {
          this.errorBotlistLoading = { message: "Неизвестная ошибка" };
        }
      } finally {
      }
    },
    async toggleModal() {
      this.createDialogModal = true;
      if (this.createDialogResult) {
        this.createDialogResult.message = "";
      }
    },
    async closeModal() {
      this.createDialogModal = false;
    },
    async appendDialog(dialogId: string) {
      try {
        const response = await fetch(
          `https://drvcash.com/backendapi/bot/${dialogId}/new-message`,
          {
            method: "PUT",
            body: JSON.stringify({
              assistantMessage: this.assistantMessage,
              userMessage: this.userMessage,
            }),
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data: {
          message: string;
          messages: {
            newUserMessageSaveResult: {
              _id: string;
              content: string;
              role: "user" | "assistant";
            };
            newAssistantMessageSaveResult: {
              _id: string;
              content: string;
              role: "user" | "assistant";
            };
          };
        } = await response.json();
        console.log(data.message);

        if (
          this.fetchMessagesResult !== null &&
          this.fetchMessagesResult.dialog
        ) {
          // Проверяем fetchMessagesResult и dialog, чтобы убедиться, что они существуют
          this.fetchMessagesResult.dialog.messages.push(
            data.messages.newUserMessageSaveResult,
            data.messages.newAssistantMessageSaveResult
          );
        }

        this.fetchDialogsResult.dialogs.forEach((element, index) => {
          if (element._id === dialogId) {
            this.fetchDialogsResult.dialogs[index].messages.push(
              data.messages.newUserMessageSaveResult,
              data.messages.newAssistantMessageSaveResult
            );
          }
        });

        this.userMessage = "";
        this.assistantMessage = "";
      } catch (error) {
        if (error instanceof Error) {
          this.error = error;
          this.isError = true;
        } else {
          this.error = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isLoading = false;
      }
    },
    async fetchMessages(dialogId: string) {
      try {
        this.isLoadingFetchDialogMessages = true;
        const response = await fetch(
          `https://drvcash.com/backendapi/bot/${dialogId}/dialog`,
          {
            method: "get",
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data: {
          message: string;
          dialog: {
            _id: string;
            name: string;
            messages: {
              content: string;
              role: "user" | "assistant";
              _id: string;
            }[];
          };
        } = await response.json();

        if (data.message === "Диалог получен!") {
          this.fetchMessagesResult = data;
        }
      } catch (error) {
        if (error instanceof Error) {
          this.error = error;
          this.isError = true;
        } else {
          this.error = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isLoadingFetchDialogMessages = false;
      }
    },
    async fineTuning() {
      try {
        const botList = this.botList.filter((bot) => bot.checkStatus);
        await fetch(
          `https://drvcash.com/backendapi/bot/tuning`,
          {
            method: "post",
            body: JSON.stringify({
              botList
            }),
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
              "Content-Type": "application/json",
            },
          }
        );

      } catch (error) {
        if (error instanceof Error) {
          this.error = error;
          this.isError = true;
        } else {
          this.error = { message: "Неизвестная ошибка" };
        }
      } finally {

      }
    },
    // Дополнительные actions для удаления, добавления, принятия предложений...
  },
});

// stores/botStore.ts
import { defineStore } from "pinia";
import type { Sentence, SentencesResponse } from "@/types/sentences";
import type { ApiError } from "@/types/error";

export const useBotStore = defineStore("bot", {
  state: () => ({
    botName: "",
    botDescription: "",
    botList: [] as { name: string; description: string; _id: string }[],
    declineSentenceResponse: {
      message: "",
    },

    isLoading: false,
    isLoadingFetchBotlist: false,

    isError: false,
    isErrorBotlistLoading: false,

    error: null as ApiError | null,
    errorBotlistLoading: null as ApiError | null,

    addSentences: "",
    addSentencesLanguage: "ru",

    randomSentenceTranslateText: "",
  }),
  actions: {
    async createBot() {
      this.isLoading = true;
      try {
        const response = await fetch("http://localhost:5555/api/bot", {
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
            _id: string;
          };
        } = await response.json();

        if (!response.ok) {
          const error = new Error();
          error.message = data.message;
          error.name = "Ошибка";
        } else {
          this.botList.push(data.bot);
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
      this.isLoadingFetchBotlist = true;
      this.botList = []; // Очистка списка перед загрузкой
      try {
        const response = await fetch("http://localhost:5555/api/bot", {
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
    // Дополнительные actions для удаления, добавления, принятия предложений...
  },
});

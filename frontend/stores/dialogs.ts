// stores/sentencesStore.ts
import { defineStore } from "pinia";
import type { Sentence, SentencesResponse } from "@/types/sentences";
import type { IMessage, DiloagsResponse, Dialog } from "@/types/dialogs";
import type { ApiError } from "@/types/error";

export const useDialogsStore = defineStore("dialogs", {
  state: () => ({
    dialogs: [] as Dialog[],
    messages: [] as IMessage[],
    acceptedSentence: {} as Sentence,

    declineSentenceResponse: {
      message: "",
    },

    isLoading: false,
    isLoadingAcceptSentence: false,
    isLoadingFetchAcceptedSentence: false,
    isSavingDialog: false,
    isLoadingDeclineSentence: false,

    isError: false,
    isErrorAcceptSentence: false,
    isErrorFetchAcceptedSentence: false,
    isErrorAddSentence: false,
    isErrorDeclineSentence: false,

    error: null as ApiError | null,
    errorAcceptSentence: null as ApiError | null,
    errorFetchAcceptedSentence: null as ApiError | null,
    errorAddSentence: null as ApiError | null,
    errorDeclineSentence: null as ApiError | null,

    addSentences: "",
    addSentencesLanguage: "ru",

    randomSentenceTranslateText: "",
  }),
  actions: {
    // Получение диалогов
    async fetchDialogs() {
      this.isLoading = true;
      try {
        const response = await fetch("https://drvcash.com/backendapi/dialogs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${useCookie("token").value}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          //   throw new Error();
        }

        const data: DiloagsResponse = await response.json();
        this.dialogs = data.dialogs.map((dialog) => ({
          ...dialog,
          checkStatus: false,
        }));
      } catch (error) {
        if (error instanceof Error) {
          this.error = { message: error.message };
          this.isError = true;
        } else {
          this.error = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isLoading = false;
      }
    },

    toggleDialogCheckStatus(dialogId: string, checked: boolean) {
      const dialog = this.dialogs.find((d) => d._id === dialogId);
      if (dialog) {
        dialog.checkStatus = checked;
      }
    },
    // Дополнительные actions для удаления, добавления, принятия предложений...
  },
});

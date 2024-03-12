// stores/sentencesStore.ts
import { defineStore } from "pinia";
import type { ApiError } from "@/types/error";
import type { IRecipient, IUser, RecipientsResponse, UsersResponse } from "@/types/users";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {},
    users: [] as IUser[],
    recipients: [] as IRecipient[],
    recipientID: "",
    recipient: {} as {
      _id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      telegramChatId: number;
      role: string;
      rating: number;
      createdAt: any;
      updatedAt: any;
      messages: {
        content: string;
        _id: string;
        role: string
      }[]
    },

    isLoading: false,
    isFetchingUsers: false,
    isFetchingRecipient: false,
    isFetchingRecipients: false,

    isError: false,
    isErrorFetchingUsers: false,
    isErrorFetchingRecipient: false,
    isErrorFetchingRecipients: false,

    error: null as ApiError | null,
    errorFetchingUsers: null as ApiError | null,
    errorFetchingRecipient: null as ApiError | null,
    errorFetchingRecipients: null as ApiError | null,
  }),
  actions: {
    async fetchUser() {
      this.isLoading = true;
      try {
        const response = await fetch("https://drvcash.com/backendapi/users/getMe", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${useCookie("token").value}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          //   throw new Error();
        } else {
          this.user = data.user;
        }
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
    async fetchRecipient(recipientID: string) {
      this.isFetchingRecipient = true;
      try {
        const response = await fetch(
          "https://drvcash.com/backendapi/chat/get-recipient/" + recipientID,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          //   throw new Error();
        } else {
          this.recipient = data.user;
        }
      } catch (error) {
        if (error instanceof Error) {
          this.errorFetchingRecipient = { message: error.message };
          this.isErrorFetchingRecipient = true;
        } else {
          this.errorFetchingRecipient = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isFetchingRecipient = false;
      }
    },
    async fetchUsers() {
      this.isFetchingUsers = true;
      try {
        const response = await fetch("https://drvcash.com/backendapi/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${useCookie("token").value}`,
            "Content-Type": "application/json",
          },
        });

        const data: UsersResponse = await response.json();

        if (!response.ok) {
          //   throw new Error();
        } else {
          this.users = data.users;
        }
      } catch (error) {
        if (error instanceof Error) {
          this.errorFetchingUsers = { message: error.message };
          this.isErrorFetchingUsers = true;
        } else {
          this.errorFetchingUsers = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isFetchingUsers = false;
      }
    },
    async fetchRecipients() {
      this.isFetchingRecipients = true;
      try {
        const response = await fetch(
          "https://drvcash.com/backendapi/chat/recipients",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data: RecipientsResponse = await response.json();

        if (!response.ok) {
          //   throw new Error();
        } else {
          this.recipients = data.users;
        }
      } catch (error) {
        if (error instanceof Error) {
          this.errorFetchingRecipients = { message: error.message };
          this.isErrorFetchingRecipients = true;
        } else {
          this.errorFetchingRecipients = { message: "Неизвестная ошибка" };
        }
      } finally {
        this.isFetchingRecipients = false;
      }
    },
    // Дополнительные actions для удаления, добавления, принятия предложений...
  },
});

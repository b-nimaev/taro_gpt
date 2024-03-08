// stores/sentencesStore.ts
import { defineStore } from "pinia";
import type { ApiError } from "@/types/error";
import type { IUser, UsersResponse } from "@/types/users";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {},
    users: [] as IUser[],

    isLoading: false,
    isFetchingUsers: false,

    isError: false,
    isErrorFetchingUsers: false,

    error: null as ApiError | null,
    errorFetchingUsers: null as ApiError | null,
  }),
  actions: {
    async fetchUser() {
      this.isLoading = true;
      try {
        const response = await fetch("http://localhost:5555/api/users/getMe", {
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
    async fetchUsers() {
      this.isFetchingUsers = true;
      try {
        const response = await fetch("http://localhost:5555/api/users", {
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
    // Дополнительные actions для удаления, добавления, принятия предложений...
  },
});

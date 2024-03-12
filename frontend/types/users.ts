import type { IMessage } from "./dialogs";

// types/users.ts
export interface IUser {
    _id?: string;
    username: string,
    firstName: string,
    lastName: string,
    avatar: string,
    role: string
}

export interface IRecipient {
    _id?: string;
    username: string,
    firstName: string,
    lastName: string,
    telgramChatId: number,
    phoneNumber: number,
    messages: IMessage[]
}

export interface UserState {
  users: IUser[];
  isLoading: boolean;
  error: Error | null;
}

export interface UsersResponse {
  message: string;
  count: number;
  users: IUser[];
}

export interface RecipientsResponse {
  message: string;
  count: number;
  users: IRecipient[];
}
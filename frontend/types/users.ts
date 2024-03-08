// types/sentences.ts
export interface IUser {
    _id?: string;
    username: string,
    firstName: string,
    lastName: string,
    avatar: string
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
// types/sentences.ts
export interface IMessage {
    _id?: string;
    role: 'system' | 'assistant' | 'user',
    content: string
}

export interface Dialog {
  _id: string;
  name: string;
  messages: IMessage[];
  author: {
    _id: string;
    firstName: string;
    username: string;
    email: string;
  }; // Пример, адаптируйте под вашу структуру
  checkStatus: boolean;
  // Дополнительные поля...
}

export interface DialogsState {
  messages: IMessage[];
  isLoading: boolean;
  error: Error | null;
}

export interface DiloagsResponse {
  message: string;
  count: number;
  dialogs: Dialog[];
}
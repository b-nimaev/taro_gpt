import { Document, Schema, Types, model } from 'mongoose';

interface IMessage extends Document {
  role: 'system' | 'assistant' | 'user';
  content: string;
}

interface IDialog extends Document {
  messages: IMessage[];
  author: Types.ObjectId;
  name: string;
}

const messageSchema = new Schema<IMessage>({
    role: { type: String, required: true },
    content: { type: String, required: true },
});

const MessageModel = model<IMessage>("Message", messageSchema);

const dialogSchema = new Schema<IDialog>({
  name: { type: String },
  messages: { type: [ Schema.Types.ObjectId ], default: [], ref: 'Message' },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const DialogModel = model<IDialog>('Dialog', dialogSchema);

export { DialogModel, dialogSchema, IMessage, IDialog };
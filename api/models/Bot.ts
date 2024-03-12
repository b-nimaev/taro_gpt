import { Document, Schema, Types, model } from "mongoose";

interface IBot extends Document {
  name: string;
  dialogs: Types.ObjectId[];
  description: string;
  users: Types.ObjectId[];
  session: string;
  userID: number;

  appID: number;
  hash: string;
  phoneNumber: number;
  phoneCode: string;
  password: string;
}

const BotSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    dialogs: { type: [Schema.Types.ObjectId], default: [], ref: "Dialog" },
    users: { type: [Schema.Types.ObjectId], default: [], ref: "recipients" },
    session: { type: String, default: "" },
    userID: { type: Number, default: 0 },

    appId: { type: Number },
    hash: { type: String },
    phoneNumber: { type: Number },
    phoneCode: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

const Bot = model<IBot>("Bot", BotSchema);

export default Bot;

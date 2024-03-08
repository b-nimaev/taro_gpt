import { Document, Schema, Types, model } from "mongoose";

interface IBot extends Document {
  name: string;
  dialogs: Types.ObjectId[];
  description: string;
}

const BotSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    dialogs: { type: [ Schema.Types.ObjectId ], default: [], ref: 'Dialog' },
  },
  {
    timestamps: true,
  }
);

const Bot = model<IBot>("Bot", BotSchema);

export default Bot;

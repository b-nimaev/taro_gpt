import { Document, Schema, Types, model } from "mongoose";

interface IBot extends Document {
  name: string;
  description: string;
}

const BotSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Bot = model<IBot>("Bot", BotSchema);

export default Bot;

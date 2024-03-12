import mongoose, { Document, Schema, Types, model } from 'mongoose';
import { IMessage } from './Dialog';

interface IRecipient extends Document {
  Recipientname?: string;
//   password: string;

  firstName?: string;
  lastName?: string;

//   email?: string;
  birthdate?: Date;
  avatar?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role?: string;
  isActive?: boolean;
  gender?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    // и так далее...
  };
  telegramRecipientname?: string;
  telegramChatId?: number;
  telegramUsername?: string;

  rating: number,

  lastActivity?: Date;
  activeSockets?: string[]; // Идентификаторы активных сокетов

  messages: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
  getPublicProfile(): IPublicRecipient;
}

interface IPublicRecipient {
  Recipientname?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  rating: number;
  // Другие публичные поля, которые вы хотите включить
}

const RecipientSchema = new Schema(
  {
    //   password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: mongoose.Schema.Types.Mixed,
    telegramChatId: mongoose.Schema.Types.Mixed,

    //   email: { type: String, unique: true },
    birthdate: { type: Date },
    avatar: { type: String },
    rating: { type: Number, default: 100 },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    role: { type: String, default: "Recipient" },

    isActive: { type: Boolean, default: false },
    lastActivity: { type: Date },
    activeSockets: [{ type: String }], // Идентификаторы активных сокетов

    gender: { type: String, enum: ["male", "female", "other"] },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      // и так далее...
    },
    
    messages: { type: [Schema.Types.ObjectId], default: [], ref: "Message" },

    telegramRecipientname: { type: String },
    telegramUsername: { type: String },
  },
  {
    timestamps: true,
  }
);

// Добавляем метод getPublicProfile
RecipientSchema.methods.getPublicProfile = function (): IPublicRecipient {
  const publicRecipient: IPublicRecipient = {
    firstName: this.firstName,
    lastName: this.lastName,
    // email: this.email,
    avatar: this.avatar,
    rating: this.rating,
    // Другие публичные поля
  };
  return publicRecipient;
};

const Recipient = model<IRecipient>('Recipient', RecipientSchema);

export default Recipient;

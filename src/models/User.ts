import { Schema, models, model } from "mongoose";
import type { AuthRole } from "@/types/auth";

export type UserDocument = {
  name: string;
  email: string;
  passwordHash: string;
  role: AuthRole;
};

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User =
  models.User || model<UserDocument>("User", userSchema);

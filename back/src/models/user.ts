import { ObjectId } from "mongodb";
import { Schema, model, Types } from "mongoose";
import type { ClubInterface } from "./club";
import { UserBookInterface } from "./user-book";

export interface UserInterface {
  _id: ObjectId;
  email: string;
  password: string;
  tokens: string[];
  name: string;
  clubs: Types.DocumentArray<ClubInterface>;
  userBooks: Types.DocumentArray<UserBookInterface>;
}

const userSchema = new Schema<UserInterface>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens: [String],
  name: { type: String, required: true },
  clubs: [{ type: Schema.Types.ObjectId, ref: "Club" }],
  userBooks: [{ type: Schema.Types.ObjectId, ref: "UserBook" }],
});

export const UserModel = model<UserInterface>("User", userSchema);

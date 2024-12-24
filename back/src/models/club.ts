import { ObjectId } from "mongodb";
import { Schema, model, Types } from "mongoose";
import type { UserInterface } from "./user";
import { BookInterface } from "./book";

export interface ClubInterface {
  _id: ObjectId;
  name: string;
  description: string;
  members: Types.DocumentArray<UserInterface>;
  books: Types.DocumentArray<BookInterface>;
}

const clubSchema = new Schema<ClubInterface>({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  books: [{ type: Schema.Types.ObjectId, ref: "Book" }]
});

export const ClubModel = model<ClubInterface>("Club", clubSchema);

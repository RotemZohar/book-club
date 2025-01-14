import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
import { ClubInterface } from "./club";

export interface BookInterface {
  _id: ObjectId;
  title: string;
  author: string;
  description: string;
  pages: number;
  cover: string;
  startDate: Date;
  endDate: Date;
  clubId: ClubInterface["_id"];
}

const bookSchema = new Schema<BookInterface>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number },
  cover: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
});

export const BookModel = model<BookInterface>("Book", bookSchema);

import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

export interface BookInterface {
  _id: ObjectId;
  title: string;
  author: string;
  description: string;
  pages: number;
  cover: string; 
  startDate: Date;
  endDate: Date;
}

const bookSchema = new Schema<BookInterface>({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: String },
  pages: { type: Number },
  cover: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

export const BookModel = model<BookInterface>("Book", bookSchema);

import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
import { BookInterface } from "./book";

interface ProgressInterface {
  _id: ObjectId;
  percentage: number;
  comment?: string;
}

const progressSchema = new Schema<ProgressInterface>({
  percentage: { type: Number, required: true },
  comment: { type: String },
});

interface ReviewInterface {
  _id: ObjectId;
  rating: number;
  description?: string;
}

const reviewSchema = new Schema<ReviewInterface>({
  rating: { type: Number, required: true },
  description: { type: String },
});

export interface UserBookInterface {
  _id: ObjectId;
  startDate: Date;
  endDate: Date;
  review?: ReviewInterface;
  progress: ProgressInterface[];
  bookId: BookInterface["_id"];
}

const bookSchema = new Schema<UserBookInterface>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  progress: [progressSchema],
  review: reviewSchema,
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
});

export const UserBookModel = model<UserBookInterface>("UserBook", bookSchema);

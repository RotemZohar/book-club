import { ObjectId } from "mongodb";
import { Schema } from "mongoose";

export interface TaskInterface {
  _id: ObjectId;
  title: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  isCompleted: boolean;
}

export const taskSchema = new Schema<TaskInterface>({
  title: { type: String, required: true },
  description: { type: String },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  isCompleted: { type: Boolean, required: true },
});

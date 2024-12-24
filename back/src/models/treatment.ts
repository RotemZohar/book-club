import { ObjectId } from "mongodb";
import { Schema } from "mongoose";

export interface TreatmentInterface {
  _id: ObjectId;
  treatment: string;
  date: Date;
}

export const treatmentSchema = new Schema<TreatmentInterface>({
  treatment: { type: String, required: true },
  date: { type: Date, required: true },
});

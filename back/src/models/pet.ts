import { Schema, model, Types } from "mongoose";
import { ObjectId } from "mongodb";
import { TreatmentInterface, treatmentSchema } from "./treatment";
import { GroupInterface } from "./group";
import { UserInterface } from "./user";
import { TaskInterface, taskSchema } from "./task";

export interface PetInterface {
  _id: ObjectId;
  name: string;
  medical: TreatmentInterface[];
  members: Types.DocumentArray<UserInterface>;
  tasks: TaskInterface[];
  groups: Types.DocumentArray<GroupInterface>;
  birthdate: Date;
  species: string;
  breed: string;
  height: string;
  weight: string;
  imgUrl: string;
}

const petSchema = new Schema<PetInterface>({
  name: { type: String, required: true },
  medical: [treatmentSchema],
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tasks: [taskSchema],
  groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  birthdate: { type: Date, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  imgUrl: { type: String, required: true },
});

export const PetModel = model<PetInterface>("Pet", petSchema);

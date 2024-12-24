import { ObjectId } from "mongodb";
import { Schema, model, Types } from "mongoose";
import type { PetInterface } from "./pet";
import type { UserInterface } from "./user";

export interface GroupInterface {
  _id: ObjectId;
  name: string;
  description: string;
  members: Types.DocumentArray<UserInterface>;
  pets: Types.DocumentArray<PetInterface>;
}

const groupSchema = new Schema<GroupInterface>({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
});

export const GroupModel = model<GroupInterface>("Group", groupSchema);

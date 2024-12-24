import { ObjectId } from "mongodb";
import { Schema, model, Types } from "mongoose";
import type { GroupInterface } from "./group";
import type { PetInterface } from "./pet";

export interface UserInterface {
  _id: ObjectId;
  email: string;
  password: string;
  tokens: string[];
  name: string;
  groups: Types.DocumentArray<GroupInterface>;
  pets: Types.DocumentArray<PetInterface>;
}

const userSchema = new Schema<UserInterface>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens: [String],
  name: { type: String, required: true },
  groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
});

export const UserModel = model<UserInterface>("User", userSchema);

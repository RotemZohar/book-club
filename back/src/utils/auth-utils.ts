import "dotenv/config";
import { ReqUser } from "../types";

// TODO: Is there a better way to ensure the environment variable is set?
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("Missing environment variable ACCESS_TOKEN_SECRET");
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing environment variable REFRESH_TOKEN_SECRET");
}

export const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// TODO: Maybe move this somewhere else? Where to
export const isReqUser = (arg: any): arg is ReqUser =>
  arg && typeof arg._id === "string";

export const getTokenFromHeader = (authHeader: string | undefined) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error();
  }

  return authHeader.split(" ")[1];
};

import mongoose from "mongoose";

const IS_DEV = process.env.NODE_ENV === "development";

export const connectToDB = async () => {
  const { DB_NAME, DB_USER_NAME, DB_PASSWORD, DB_URL } = process.env;
  let uri: string;

  if (IS_DEV) {
    uri = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;
  } else {
    uri = `mongodb://${DB_URL}/${DB_NAME}`;
  }

  await mongoose.connect(uri);
  console.log("Connected to DB");
};

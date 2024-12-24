import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { authMiddleware } from "../src/middlewares/auth-middleware";

const mongod = new MongoMemoryServer();

/**
 * Connect to mock memory db.
 */
export const connect = async () => {
  authMiddleware();
  const { DB_USER_NAME, DB_PASSWORD } = process.env;
  const uri = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@menahem.jjn8m.mongodb.net/testing?retryWrites=true&w=majority`;
  await mongoose.connect(uri);
};

/**
 * Close db connection
 */
export const closeDatabase = async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Delete db collections
 */
// export const clearDatabase = async () => {
//   const { collections } = mongoose.connection;

//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany({});
//   }
// };

import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/auth-utils";
import { authMiddleware } from "../middlewares/auth-middleware";

const authRouter = Router();

const addUser = async (email: string, password: string, name: string) => {
  const salt = await bcrypt.genSalt(10);
  const encPass = await bcrypt.hash(password, salt);
  const userToSave = new UserModel({ email, password: encPass, name });
  return userToSave.save();
};

const getAccessToken = (userId: string) =>
  jwt.sign({ _id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: "1 day" });

const getRefreshToken = (userId: string) =>
  jwt.sign({ _id: userId }, REFRESH_TOKEN_SECRET);

authRouter.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json("Missing username/email/password");
  }

  const user = await UserModel.exists({ email });

  if (user) {
    res.status(400).json("Email already exists");
    return;
  }

  await addUser(email, password, name);

  res.sendStatus(201);
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Bad username or password");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(400).json("Bad username or password");
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400).json("Bad username or password");
    return;
  }

  // Get user tokens
  const accessToken = getAccessToken(user._id.toString());
  const refreshToken = getRefreshToken(user._id.toString());

  // Save refresh tokens for user
  if (!user.tokens) {
    user.tokens = [refreshToken];
  } else {
    user.tokens.push(refreshToken);
  }

  await user.save();

  res.status(200).json({ accessToken, refreshToken, userId: user.id });
});

authRouter.post("/refresh-token", authMiddleware(false), async (req, res) => {
  const { token, _id } = req.user;
  const user = await UserModel.findById(_id);

  if (!user) {
    res.sendStatus(403);
    return;
  }

  if (!user.tokens.includes(token)) {
    user.tokens = [];
    await user.save();
    res.sendStatus(403);
    return;
  }

  // Create new tokens
  const accessToken = getAccessToken(_id);
  const refreshToken = getRefreshToken(_id);

  // Save the new token and delete the prev one
  user.tokens[user.tokens.indexOf(token)] = refreshToken;
  await user.save();

  res.status(200).json({ accessToken, refreshToken });
});

authRouter.post("/logout", authMiddleware(true), async (req, res) => {
  const { token, _id } = req.user;

  const user = await UserModel.findById(_id);

  if (!user) {
    res.sendStatus(403);
    return;
  }

  if (!user.tokens.includes(token)) {
    user.tokens = [];
    await user.save();
    res.status(403);
  }

  user.tokens.splice(user.tokens.indexOf(token), 1);
  await user.save();

  res.sendStatus(200);
});

export default authRouter;

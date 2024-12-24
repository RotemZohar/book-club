import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";
import { PetModel } from "../models/pet";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/auth-utils";
import { authMiddleware } from "../middlewares/auth-middleware";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for authentication in the system
 */
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

/**
 * @swagger
 * /auth/signup:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Signup user
 *    description: Validates user's username/email/password, If all is OK adds user
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              name:
 *                type: string
 *            required:
 *              - email
 *              - password
 *              - name
 *    responses:
 *      400:
 *        description: Missing username/email/password or Email already exists
 *      201:
 *        description: Succes
 */
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

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Login user
 *    description: Validates user's email/password, If all is OK login user
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      400:
 *        description: Bad username or password
 *      201:
 *        description: Succes
 *        schema:
 *          type: object
 *          properties:
 *            accessToken:
 *              type: array
 *            refreshToken:
 *              type: array
 *            userId:
 *              type: string
 */
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

/**
 * @swagger
 * /auth/refresh-token:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Refreshing user's token
 *    description: Refreshing user's token
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      403:
 *        description: Forbidden
 *      200:
 *        description: Succes
 *        schema:
 *          type: object
 *          properties:
 *            accessToken:
 *              type: array
 *            refreshToken:
 *              type: array
 */
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

/**
 * @swagger
 * /auth/logout:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Logsout of user's account
 *    description: Logsout of user's account
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      403:
 *        description: Forbidden
 *      200:
 *        description: Succes
 */
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

/**
 * @swagger
 * /auth/{petId}/medical/guests:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: medical information for guests
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: petId
 *        in: path
 *        schema:
 *          type: string
 *    responses:
 *      400:
 *        description: Parameter is missing
 *      201:
 *        description: Succes
 */
authRouter.get("/:petId/medical/guests", async (req, res) => {
  const { petId } = req.params;

  if (!petId) {
    return res.status(400).json("Parameter is missing");
  }

  const petMedical = await PetModel.findOne({ _id: petId })
    .populate({ path: "members", select: ["name", "email"] })
    .select(["medical", "name", "imgUrl"]);

  res.status(201).json(petMedical);
});

export default authRouter;
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  getTokenFromHeader,
  isReqUser,
  REFRESH_TOKEN_SECRET,
} from "../utils/auth-utils";

export const authMiddleware =
  (isAccessToken = true) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    let token: string;

    try {
      token = getTokenFromHeader(authHeader);
    } catch (e) {
      res.sendStatus(401);
      return;
    }

    const secret = isAccessToken ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      if (!isReqUser(decoded)) {
        res.sendStatus(500);
        return;
      }

      req.user = decoded;
      req.user.token = token;
      next();
    });
  };

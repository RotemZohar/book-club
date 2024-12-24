export interface ReqUser {
  _id: string;
  token: string;
}

declare global {
  namespace Express {
    interface Request {
      user: ReqUser;
    }
  }
}

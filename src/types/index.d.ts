export {};

interface IUserData {
  id?: string;
  email?: string;
  username?: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserData;
    }
  }
}

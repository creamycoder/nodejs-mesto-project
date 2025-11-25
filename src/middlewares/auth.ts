import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from "utils/type";

export const { JWT_SECRET = 'dev-secret' } = process.env;
const CustomError = require('../errors/customErrors');

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) return next(CustomError.Unauthorized('Необходима авторизация'));

  const token = authorization.replace('Bearer ', '');
  try {
   const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
   req.user = { _id: payload._id as string };
   return next();
  } catch (err) {
    return next(CustomError.Unauthorized('Необходима авторизация'));
  }
};

export default authMiddleware;
import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from "utils/type";

export const { JWT_SECRET = 'dev-secret' } = process.env;

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload as { _id: JwtPayload };
  return next();
};

export default authMiddleware;
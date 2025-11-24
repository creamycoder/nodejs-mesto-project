import { Request } from "express";
import { JwtPayload  } from 'jsonwebtoken';

export interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}
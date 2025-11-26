import { NextFunction, Request, Response } from "express";
import User from '../models/user';
import { RequestCustom } from "utils/type";
import { JWT_SECRET } from '../middlewares/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const CustomError = require('../errors/customErrors');

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then(users => res.send(users))
    .catch(next);
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) return next(CustomError.NotFound('Пользователь не найден'));
      res.send(user);
    })
    .catch(err => {
      if (err.name === 'CastError') return next(CustomError.BadRequest('Некорректный ID пользователя'));
      next(err);
    })
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({ name, about, avatar, email, password: await bcrypt.hash(password, 10) })
    .then(user => res.send({ name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id }))
    .catch(err => {
      if (err.name === 'ValidationError') return next(CustomError.BadRequest('Некорректные данные при создании пользователя'));
      if (err.code === 11000) return next(CustomError.Conflict('Пользователь с таким email уже существует'));
      next(err);
    })
};

export const updateUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) return next(CustomError.NotFound('Пользователь не найден'));
      res.send(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') return next(CustomError.BadRequest('Некорректные данные профиля'));
      next(err);
    })
}

export const updateAvatar = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) return next(CustomError.NotFound('Пользователь не найден'));
      res.send(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') return next(CustomError.BadRequest('Некорректные данные аватара'));
      next(err);
    })
};

export const login = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: true
      });

      res.send({ token, message: 'Успешная авторизация' });
    })
    .catch(() => {
      next(CustomError.Unauthorized('Неверный email или пароль'));
    })
};

export const getCurrentUser = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId) return next(CustomError.Unauthorized('Требуется авторизация'));
  User.findById(userId)
    .then(user => {
      if (!user) return next(CustomError.NotFound('Пользователь не найден'));
      return res.send(user);
    })
    .catch(err => {
      if (err.name === 'CastError') return next(CustomError.BadRequest('Некорректный ID пользователя'));
      next(err);
    })
};

export default { getUsers, createUser, getUserById, updateUser, updateAvatar, login, getCurrentUser };
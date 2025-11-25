import { Request, Response } from "express";
import User from '../models/user';
import { RequestCustom } from "utils/type";
import STATUS from '../utils/constants';
import { JWT_SECRET } from '../middlewares/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(STATUS.OK).json(users);
  } catch (error) {
    console.error(error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, about, avatar, email, password: hashedPassword });

    return res.status(STATUS.CREATED).json(user);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'ValidationError') return res.status(STATUS.BAD_REQUEST).send({ "message": "Переданы некорректные данные при создании пользователя" });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(STATUS.NOT_FOUND).send({ "message": "Пользователь по указанному _id не найден" });
    return res.status(STATUS.OK).json(user);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'CastError') return res.status(STATUS.BAD_REQUEST).send({ "message": "Передан некорректный _id пользователя" });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const updateProfile = async (req: RequestCustom, res: Response) => {
  try {
    const { name, about } = req.body;
    const id = req.user?._id;
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true });
    if (!user) return res.status(STATUS.NOT_FOUND).send({ "message": "Пользователь с указанным _id не найден" });
    return res.status(STATUS.OK).json(user);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'ValidationError') return res.status(STATUS.BAD_REQUEST).send({ "message": "Переданы некорректные данные при обновлении профиля" });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const updateAvatar = async (req: RequestCustom, res: Response) => {
  try {
    const { avatar } = req.body;
    const id = req.user?._id;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true });
    if (!user) return res.status(STATUS.NOT_FOUND).send({ "message": "Пользователь с указанным _id не найден" });
    return res.status(STATUS.OK).json(user);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'ValidationError') return res.status(STATUS.BAD_REQUEST).send({ "message": "Переданы некорректные данные при обновлении аватара" });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const login = async (req: RequestCustom, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(STATUS.UNAUTHORIZED).send({ "message": "Неправильные почта или пароль" });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(STATUS.UNAUTHORIZED).send({ "message": "Неправильные почта или пароль" });
    const token = jwt.sign(
      { _id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: true
      })
      .status(200)
      .json({ token, message: 'Успешная авторизация' });
  } catch(error: any) {
    console.error(error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const getCurrentUser = async (req: RequestCustom, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(STATUS.UNAUTHORIZED).send({ "message": "Требуется авторизация" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(STATUS.NOT_FOUND).send({ "message": "Пользователь не найден" });
    }

    return res.status(STATUS.OK).json(user);
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export default { getUsers, createUser, getUserById, updateProfile, updateAvatar, login, getCurrentUser };
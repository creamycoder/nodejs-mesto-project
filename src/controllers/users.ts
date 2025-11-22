import { Request, Response } from "express";
import User from '../models/user';
import user from "../models/user";
import { RequestCustom } from "utils/type";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Произошла ошибка' })
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });

    return res.status(201).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Произошла ошибка' })
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Произошла ошибка' })
  }
};

export const updateProfile = async (req: RequestCustom, res: Response) => {
  try {
    const { name, about } = req.body;
    const id = req.user?._id;
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true });
    return res.status(201).json({ data: user });
  } catch (error) {
    console.error(error);
  }
};

export const updateAvatar = async (req: RequestCustom, res: Response) => {
  try {
    const { avatar } = req.body;
    const id = req.user?._id;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true });
    return res.status(201).json({ data: user });
  } catch (error) {
    console.error(error);
  }
};

export default { getUsers, createUser, getUserById, updateProfile, updateAvatar };
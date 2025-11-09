import { Request, Response } from "express";
import User from '../models/user';

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
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Произошла ошибка' })
  }
};

export default { getUsers, createUser, getUserById };
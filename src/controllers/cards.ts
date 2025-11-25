import Card from "../models/card";
import { Response, Request } from "express";
import { RequestCustom } from "../utils/type";
import STATUS from '../utils/constants';

export const createCard = async (req: RequestCustom, res: Response) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;
    if (!owner) return res.status(STATUS.BAD_REQUEST).send({ "message": "Переданы некорректные данные при создании карточки" });
    const card = await Card.create({ name, link, owner });
    return res.status(STATUS.CREATED).json(card);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'ValidationError') return res.status(STATUS.BAD_REQUEST).send({ "message": "Переданы некорректные данные при создании карточки" });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(STATUS.OK).json(cards);
  } catch (error) {
    console.error(error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const deleteCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) return res.status(STATUS.NOT_FOUND).send({ "message": "Карточки с указанным _id не найдена" });
    if (card.owner.toString() !== req.user?._id) return res.status(STATUS.FORBIDDEN).send({ "message": "Нельзя удалить чужую карточку" });

    await card.deleteOne();

    return res.status(STATUS.OK).json({ "message": "Карточка удалена" });
  } catch (error: any) {
    console.error(error);
    if (error.name === 'CastError') return res.status(STATUS.BAD_REQUEST).send({ "message": "Передан некорректный _id карточки" });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const likeCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;
    const id = req.user?._id;
    const card = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: id }}, { new: true });
    if (!card) return res.status(STATUS.NOT_FOUND).send({ "message": "Передан несуществующий _id карточки" });
    return res.status(STATUS.OK).json(card);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'CastError') return res.status(STATUS.BAD_REQUEST).send({ "message": "Переданы некорректные данные для постановки лайка" });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export const dislikeCard = async (req: RequestCustom, res: Response) => {
  try {
    const { cardId } = req.params;
    const id = req.user?._id;
    const card = await Card.findByIdAndUpdate(cardId, { $pull: { likes: id }}, { new: true });
    if (!card) return res.status(STATUS.NOT_FOUND).send({ "message": "Передан несуществующий _id карточки" });
    return res.status(STATUS.OK).json(card);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'CastError') return res.status(STATUS.BAD_REQUEST).send({ "message": "Переданы некорректные данные для постановки лайка" });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ "message": "На сервере произошла ошибка" });
  }
};

export default { createCard, getCards, deleteCard, likeCard, dislikeCard };


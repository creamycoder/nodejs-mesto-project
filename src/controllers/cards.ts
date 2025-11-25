import Card from "../models/card";
import { Response, Request, NextFunction } from "express";
import { RequestCustom } from "../utils/type";

const CustomError = require('../errors/customErrors');

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(next);
};

export const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'ValidationError') return next(CustomError.BadRequest('Некорректные данные карты'));
      next(err);
    })
};

export const deleteCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then(card => {
      if (!card) return next(CustomError.NotFound('Карточка не найдена'));
      if (card.owner.toString() !== req.user?._id) return next(CustomError.Forbidden('Нельзя удалять чужие карточки'));
      return card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(err => {
      if (err.name === 'CastError') return next(CustomError.BadRequest('Некорректный ID карточки'));
      next(err);
    })
};

export const likeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true }
  )
    .then(card => {
      if (!card) return next(CustomError.NotFound('Карточка не найдена'));
      return res.send({card});
    })
    .catch(err => {
      if (err.name === 'CastError') return next(CustomError.BadRequest('Некорректный ID карточки'));
      next(err);
    })
};

export const dislikeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true }
  )
    .then(card => {
      if (!card) return next(CustomError.NotFound('Карточка не найдена'));
      return res.send({card});
    })
    .catch(err => {
      if (err.name === 'CastError') return next(CustomError.BadRequest('Некорректный ID карточки'));
      next(err);
    })
};

export default { createCard, getCards, deleteCard, likeCard, dislikeCard };


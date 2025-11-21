import Card from "../models/card";
import { Response, Request } from "express";
import { RequestCustom } from "../type";

export const createCard = async (req: RequestCustom, res: Response) => {

  try {
    const { name, link } = req.body;
    const owner = req.user?._id;
    const card = await Card.create({ name, link, owner });
    return res.status(201).json({ data: card });
  } catch (error) {
    console.error(error);
  }
};

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send({ data: cards });
  } catch (error) {
    console.error(error);
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    console.log(cardId);
    const card = await Card.findByIdAndDelete(cardId);
    console.log(card);
    return res.status(204).json({ data: card });
  } catch (error) {
    console.error(error);
  }
};

export default { createCard, getCards, deleteCard };


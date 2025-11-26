import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';

const CustomError = require('../errors/customErrors');
const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => {
  next(CustomError.NotFound('Маршрут не найден'));
});

export default router;
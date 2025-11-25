import { celebrate, Joi, Segments } from 'celebrate';

export const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
  }),
});

export const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

export const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
});
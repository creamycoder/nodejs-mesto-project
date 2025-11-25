import express, { Application, NextFunction, Response, json } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { validateSignin, validateSignup } from './middlewares/validation';
import { errors } from 'celebrate';


const {PORT = 3000} = process.env;

const app: Application = express();

app.use(json());
app.use(requestLogger);
app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);
app.use(auth);
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).send({ "message": "Страница не найдена" });
});

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    app.listen(PORT, () => {
      console.log(`Приложение прослушивает порт ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

connect();



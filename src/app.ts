import express, { Application, NextFunction, Response, json } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

const {PORT = 3000} = process.env;

const app: Application = express();

app.use(json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', router);

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



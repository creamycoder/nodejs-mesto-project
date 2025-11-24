import express, { Application, NextFunction, Response, json } from 'express';
import { RequestCustom } from './utils/type';
import mongoose from 'mongoose';
import router from './routes/index';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

const {PORT = 3000} = process.env;

const app: Application = express();

app.use(json());

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6910e54fbe49bb8540e76ddf'
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', router);

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



import express, { Application, NextFunction, Response, json } from 'express';
import { RequestCustom } from './type';
import mongoose from 'mongoose';
import router from './routes/index';

const {PORT = 3000} = process.env;

const app: Application = express();

app.use(json());
app.use('/', router);

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133'
  };

  next();
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



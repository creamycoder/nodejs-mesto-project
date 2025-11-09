import express, { Application, json } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';

const {PORT = 3000} = process.env;

const app: Application = express();

app.use(json());
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



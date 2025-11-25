import mongoose, { Model, Types, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const CustomError = require('../errors/customErrors');

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Некорректный email'
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, {
  versionKey: false
});

userSchema.statics.findUserByCredentials = function (email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: IUser | null) => {
      if (!user) throw CustomError.Unauthorized('Неверные почта или пароль');
      return bcrypt.compare(password, user.password).then((matched => {
        if (!matched) throw CustomError.Unauthorized('Неверные почта или пароль');
        return user;
      }))
    })
}

export default mongoose.model<IUser, UserModel>('user', userSchema);
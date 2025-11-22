import mongoose from 'mongoose';

interface ICard extends Document {
  name: string,
  link: string,
  owner: mongoose.Schema.Types.ObjectId,
  likes: Array<mongoose.Types.ObjectId>,
  createAt: Date
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: [],
    ref: 'user'
  },
  createAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

export default mongoose.model<ICard>('card', cardSchema);



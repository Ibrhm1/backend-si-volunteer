import mongoose from 'mongoose';
import * as Yup from 'yup';
import { TYPE } from '../utils/constant';

const Schema = mongoose.Schema;
export const FAQ_MODEL_NAME = 'FaQ';

export const faqDAO = Yup.object({
  question: Yup.string().required(),
  answer: Yup.string().required(),
  type: Yup.string().oneOf([TYPE.MEMBER, TYPE.ORGANIZER]).required(),
  isPublish: Yup.boolean().required(),
});

export type TypeFaq = Yup.InferType<typeof faqDAO>;
const faqSchema = new Schema<TypeFaq>(
  {
    question: {
      type: Schema.Types.String,
      required: true,
    },
    answer: {
      type: Schema.Types.String,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
    },
    isPublish: {
      type: Schema.Types.Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
).index({ type: 'text' });

const FaqModel = mongoose.model(FAQ_MODEL_NAME, faqSchema);
export default FaqModel;
